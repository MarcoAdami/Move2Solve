// SelectionPanel.tsx - Pannello per mostrare elementi selezionati (Updated)

import React, { useState, useEffect } from 'react';
import { ASTNode, Side } from '@/types/AST';

interface SelectedNode {
  node: ASTNode;
  side: Side;
}

interface SelectionPanelProps {
  selectedNodes: SelectedNode[];
  onClearSelection: () => void;
  onCombineNodes?: (result: ASTNode, selectedNodes: SelectedNode[]) => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedNodes,
  onClearSelection,
  onCombineNodes
}) => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Pulisce input e feedback quando cambiano le selezioni
  useEffect(() => {
    setUserInput('');
    setFeedback({ type: null, message: '' });
  }, [selectedNodes]);

  if (selectedNodes.length === 0) return null;

  const renderSelectedNode = (selectedNode: SelectedNode, index: number) => {
    const { node, side } = selectedNode;
    let display = '';
    let bgColor = '';

    if (node.type === 'variable') {
      const coeff = node.coefficient;
      if (coeff === 1) {
        display = 'x';
      } else if (coeff === -1) {
        display = '-x';
      } else {
        display = `${coeff}x`;
      }
      bgColor = 'bg-purple-200 border-purple-400';
    } else if (node.type === 'constant') {
      display = `${node.coefficient}`;
      bgColor = 'bg-yellow-200 border-yellow-400';
    }

    const sideColor = side === 'left' ? 'text-blue-600' : 'text-green-600';
    const sideText = side === 'left' ? 'SX' : 'DX';

    return (
      <div key={`${node.id}-${index}`} className="flex items-center space-x-2">
        <span className={`${bgColor} px-2 py-1 rounded border text-sm font-medium`}>
          {display}
        </span>
        <span className={`text-xs ${sideColor} font-medium`}>
          ({sideText})
        </span>
      </div>
    );
  };

  // Calcola il risultato corretto dell'operazione
  const calculateCorrectResult = (): { value: number, type: 'variable' | 'constant' } | null => {
    if (selectedNodes.length !== 2) return null;

    const [first, second] = selectedNodes;
    
    // Devono essere dello stesso tipo
    if (first.node.type !== second.node.type) return null;

    // FIXME: attenzione alle definizioni dei nodi selezionabili
    //        in teoria non ci sarebbero 'binary_op' ma li escludo comunque
    if(first.node.type !== 'binary_op' && second.node.type !== 'binary_op'){
      if (first.node.type === 'variable') {
      return {
        value: first.node.coefficient + second.node.coefficient,
        type: 'variable'
      };
    } else {
      return {
        value: first.node.coefficient + second.node.coefficient,
        type: 'constant'
      };
    }
    }
    
  };

  // Valida l'input dell'utente
  const validateUserInput = (input: string): boolean => {
    const correctResult = calculateCorrectResult();
    if (!correctResult) return false;

    // Pulisce l'input
    const cleanInput = input.trim().toLowerCase();

    if (correctResult.type === 'variable') {
      // Per variabili: accetta formati come "5x", "-3x", "x", "-x"
      if (cleanInput === 'x' || cleanInput === '+x') {
        return correctResult.value === 1;
      } else if (cleanInput === '-x') {
        return correctResult.value === -1;
      } else if (cleanInput.endsWith('x')) {
        const coeffStr = cleanInput.slice(0, -1);
        const coeff = coeffStr === '' || coeffStr === '+' ? 1 : 
                     coeffStr === '-' ? -1 : parseInt(coeffStr);
        return !isNaN(coeff) && coeff === correctResult.value;
      }
      return false;
    } else {
      // Per costanti: semplice numero
      const value = parseInt(cleanInput);
      return !isNaN(value) && value === correctResult.value;
    }
  };

  // Crea il nodo risultato
  const createResultNode = (): ASTNode | null => {
    const correctResult = calculateCorrectResult();
    if (!correctResult) return null;

    const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    if (correctResult.type === 'variable') {
      return {
        type: 'variable',
        name: 'x',
        coefficient: correctResult.value,
        id: generateId()
      };
    } else {
      return {
        type: 'constant',
        coefficient: correctResult.value,
        id: generateId()
      };
    }
  };

  // Gestisce la pressione di Invio
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validateUserInput(userInput)) {
        const resultNode = createResultNode();
        if (resultNode && onCombineNodes) {
          setFeedback({ type: 'success', message: '✅ Corretto! Operazione applicata.' });
          setTimeout(() => {
            onCombineNodes(resultNode, selectedNodes);
            setFeedback({ type: null, message: '' });
          }, 200);
        }
      } else {
        setFeedback({ type: 'error', message: '❌ Risultato non corretto. Riprova!' });
        setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
      }
    }
  };

  // Mostra l'operazione da eseguire
  const getOperationDisplay = (): string => {
    if (selectedNodes.length !== 2) return '';
    
    const [first, second] = selectedNodes;
    let firstDisplay = '';
    let secondDisplay = '';

    if (first.node.type === 'variable') {
      const coeff = first.node.coefficient;
      firstDisplay = coeff === 1 ? 'x' : coeff === -1 ? '-x' : `${coeff}x`;
    } else {
      firstDisplay = `${first.node.coefficient}`;
    }

    if (second.node.type === 'variable') {
      const coeff = second.node.coefficient;
      secondDisplay = coeff === 1 ? 'x' : coeff === -1 ? '-x' : `${coeff}x`;
    } else {
      secondDisplay = `${second.node.coefficient}`;
    }

    return `${firstDisplay} + ${secondDisplay} = `;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Elementi Selezionati</h4>
        <button
          onClick={onClearSelection}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Cancella selezione"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2">
        {selectedNodes.map((selectedNode, index) => renderSelectedNode(selectedNode, index))}
      </div>

      {selectedNodes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {selectedNodes.length} elemento{selectedNodes.length !== 1 ? 'i' : ''} selezionat{selectedNodes.length !== 1 ? 'i' : 'o'}
          </p>
          
          {/* Input per operazione quando ci sono 2 elementi */}
          {selectedNodes.length === 2 && (
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-2">
                Calcola: <span className="font-mono font-semibold">{getOperationDisplay()}</span>
              </div>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi il risultato e premi Invio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">
                Premi Invio per confermare
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedback.type && (
            <div className={`mt-2 p-2 rounded text-xs ${
              feedback.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};