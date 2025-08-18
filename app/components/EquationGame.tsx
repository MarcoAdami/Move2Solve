'use client'
import React, { useState, useEffect } from 'react';

// Import dei tipi
import { Equation, DraggedNode, ASTNode, Side } from '@/types/AST';

// Import delle utilità 
import { 
  changeSign, 
  getLeafNodes, 
  addNodeToAST, 
  createBinaryOp 
} from '@/utils/astUtils';

// Import della logica di gioco
import { generateEquation } from './EquationGenerator';
import { checkWin } from './GameLogic';

// Import dei componenti
import { EquationSide } from './EquationSide';
import { WinMessage } from './WinMessage';
import { GameInstructions } from './GameInstructions';
import { DebugPanel } from './DebugPanel';
import { SettingsMenu } from './SettingsMenu';
import { SelectionPanel } from './SelectionPanel';

// Interfacce per la selezione
interface SelectedNode {
  node: ASTNode;
  side: Side;
}

const EquationGame: React.FC = () => {
  const [equation, setEquation] = useState<Equation | null>(null);
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);
  const [gameWon, setGameWon] = useState(false);
  
  // Stati per le impostazioni
  const [variablesCount, setVariablesCount] = useState(1);
  const [constantsCount, setConstantsCount] = useState(1);
  
  // Stati per la selezione
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);

  // Inizializza il gioco
  useEffect(() => {
    setEquation(generateEquation({ variablesCount, constantsCount }));
  }, []);

  // Gestore drag start
  const handleDragStart = (e: React.DragEvent, node: ASTNode, path: string[], side: Side) => {
    setDraggedNode({ node, parentPath: path, side });
    e.dataTransfer.effectAllowed = 'move';
  };

  // Gestore selezione nodo
  const handleNodeSelect = (node: ASTNode, side: Side) => {
    setSelectedNodes(prevSelected => {
      // Filtra le selezioni esistenti basandosi sulle regole
      let newSelected = prevSelected.filter(selected => {
        // Regola del tipo: se selezioniamo un tipo diverso, rimuovi l'altro tipo
        if (selected.node.type !== node.type) {
          return false;
        }
        
        // Regola del lato: mantieni solo quelli dello stesso lato
        return selected.side === side;
      });

      // Controlla se il nodo è già selezionato
      const alreadySelected = newSelected.find(selected => selected.node.id === node.id);
      
      if (alreadySelected) {
        // Se già selezionato, rimuovilo
        newSelected = newSelected.filter(selected => selected.node.id !== node.id);
      } else {
        // Se non selezionato, aggiungilo
        newSelected.push({ node, side });
      }
      
      return newSelected;
    });
  };

  // Funzione per pulire la selezione
  const handleClearSelection = () => {
    setSelectedNodes([]);
  };

  // Gestore drop
  const handleDrop = (e: React.DragEvent, targetSide: Side) => {
    e.preventDefault();
    
    if (!draggedNode || !equation) return;

    // Se droppiamo nello stesso lato, non fare nulla
    if (draggedNode.side === targetSide) {
      setDraggedNode(null);
      return;
    }

    // Cambiamo il segno del nodo quando lo spostiamo dall'altra parte
    const nodeWithChangedSign = changeSign(draggedNode.node);

    // Rimuoviamo il nodo dal lato originale
    const sourceSide = draggedNode.side;
    const sourceAST = equation[sourceSide];
    
    // Per semplicità, ricreiamo l'equazione rimuovendo e aggiungendo
    const leafNodes = getLeafNodes(sourceAST);
    const remainingNodes = leafNodes.filter(leaf => leaf.node.id !== draggedNode.node.id);
    
    let newSourceAST: ASTNode | null = null;
    if (remainingNodes.length > 0) {
      newSourceAST = remainingNodes[0].node;
      for (let i = 1; i < remainingNodes.length; i++) {
        newSourceAST = createBinaryOp('+', newSourceAST, remainingNodes[i].node);
      }
    }

    // Aggiungiamo il nodo al lato target
    const targetAST = equation[targetSide];
    const newTargetAST = addNodeToAST(targetAST, nodeWithChangedSign);

    // Aggiorna l'equazione
    if (newSourceAST) {
      setEquation({
        ...equation,
        [sourceSide]: newSourceAST,
        [targetSide]: newTargetAST
      });
    }

    setDraggedNode(null);
  };

  // Gestore drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Controlla vittoria quando l'equazione cambia
  useEffect(() => {
    if (equation) {
      setGameWon(checkWin(equation));
    }
  }, [equation]);

  // Nuova equazione con parametri attuali
  const newGame = () => {
    setEquation(generateEquation({ variablesCount, constantsCount }));
    setGameWon(false);
    setSelectedNodes([]); // Pulisce la selezione
  };

  // Ottieni gli ID dei nodi selezionati per evidenziare
  const getSelectedNodeIds = (): string[] => {
    return selectedNodes.map(selected => selected.node.id);
  };

  if (!equation) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Menu delle impostazioni */}
      <SettingsMenu
        variablesCount={variablesCount}
        constantsCount={constantsCount}
        onVariablesChange={setVariablesCount}
        onConstantsChange={setConstantsCount}
      />

      {/* Pannello selezione */}
      <SelectionPanel
        selectedNodes={selectedNodes}
        onClearSelection={handleClearSelection}
      />

      <div className="max-w mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          🧮 Gioco delle Equazioni (AST)
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Trascina i termini per risolvere l'equazione!
          </h2>
          
          <div className="flex items-center justify-center space-x-8 text-2xl font-mono">
            {/* Lato sinistro */}
            <EquationSide
              ast={equation.left}
              side="left"
              selectedNodeIds={getSelectedNodeIds()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onNodeSelect={handleNodeSelect}
            />

            {/* Segno uguale */}
            <div className="text-3xl font-bold text-gray-600">=</div>

            {/* Lato destro */}
            <EquationSide
              ast={equation.right}
              side="right"
              selectedNodeIds={getSelectedNodeIds()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onNodeSelect={handleNodeSelect}
            />
          </div>
        </div>

        <WinMessage isVisible={gameWon} />

        <div className="text-center">
          <button
            onClick={newGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Nuova Equazione
          </button>
        </div>

        <GameInstructions />

        <DebugPanel equation={equation} />
      </div>
    </div>
  );
};

export default EquationGame;