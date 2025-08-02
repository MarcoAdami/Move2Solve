'use client'
import React, { useState, useEffect } from 'react';

// Definizione dell'Abstract Syntax Tree
type ASTNode = 
  | { type: 'variable'; name: string; coefficient: number; id: string }
  | { type: 'constant'; value: number; id: string }
  | { type: 'binary_op'; operator: '+' | '-'; left: ASTNode; right: ASTNode; id: string };

interface Equation {
  left: ASTNode;
  right: ASTNode;
}

interface DraggedNode {
  node: ASTNode;
  parentPath: string[];
  side: 'left' | 'right';
}

const EquationGame: React.FC = () => {
  const [equation, setEquation] = useState<Equation | null>(null);
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);
  const [gameWon, setGameWon] = useState(false);

  // Genera un ID univoco
  const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Crea un nodo variabile
  const createVariable = (coefficient: number): ASTNode => ({
    type: 'variable',
    name: 'x',
    coefficient,
    id: generateId()
  });

  // Crea un nodo costante
  const createConstant = (value: number): ASTNode => ({
    type: 'constant',
    value,
    id: generateId()
  });

  // Crea un nodo operazione binaria
  const createBinaryOp = (operator: '+' | '-', left: ASTNode, right: ASTNode): ASTNode => ({
    type: 'binary_op',
    operator,
    left,
    right,
    id: generateId()
  });

  // Genera una nuova equazione casuale
  const generateEquation = (): Equation => {
    // Lato sinistro: ax + b
    const leftCoeff = Math.floor(Math.random() * 5) + 1;
    const leftConst = Math.floor(Math.random() * 10) - 5;
    
    const leftVariable = createVariable(leftCoeff);
    const leftConstant = createConstant(leftConst);
    const leftSide = leftConst >= 0 
      ? createBinaryOp('+', leftVariable, leftConstant)
      : createBinaryOp('-', leftVariable, createConstant(Math.abs(leftConst)));

    // Lato destro: cx + d
    const rightCoeff = Math.floor(Math.random() * 5) + 1;
    const rightConst = Math.floor(Math.random() * 10) - 5;
    
    const rightVariable = createVariable(rightCoeff);
    const rightConstant = createConstant(rightConst);
    const rightSide = rightConst >= 0
      ? createBinaryOp('+', rightVariable, rightConstant)
      : createBinaryOp('-', rightVariable, createConstant(Math.abs(rightConst)));

    return { left: leftSide, right: rightSide };
  };

  // Inizializza il gioco
  useEffect(() => {
    setEquation(generateEquation());
  }, []);

  // Clona un nodo AST
  const cloneNode = (node: ASTNode): ASTNode => {
    if (node.type === 'variable' || node.type === 'constant') {
      return { ...node, id: generateId() };
    } else {
      return {
        ...node,
        id: generateId(),
        left: cloneNode(node.left),
        right: cloneNode(node.right)
      };
    }
  };

  // Cambia il segno di un nodo
  const changeSign = (node: ASTNode): ASTNode => {
    const cloned = cloneNode(node);
    if (cloned.type === 'variable') {
      return { ...cloned, coefficient: -cloned.coefficient };
    } else if (cloned.type === 'constant') {
      return { ...cloned, value: -cloned.value };
    } else {
      // Per operazioni binarie, cambiamo il segno del nodo radice
      if (cloned.operator === '+') {
        return { ...cloned, operator: '-' };
      } else {
        return { ...cloned, operator: '+' };
      }
    }
  };

  // Trova tutti i nodi foglia (trascinabili) di un AST
  const getLeafNodes = (node: ASTNode, path: string[] = []): Array<{ node: ASTNode; path: string[] }> => {
    if (node.type === 'variable' || node.type === 'constant') {
      return [{ node, path }];
    } else {
      return [
        ...getLeafNodes(node.left, [...path, 'left']),
        ...getLeafNodes(node.right, [...path, 'right'])
      ];
    }
  };

  // Rimuove un nodo dall'AST dato il suo path
  const removeNodeFromAST = (ast: ASTNode, targetPath: string[]): ASTNode | null => {
    if (targetPath.length === 0) return null;
    
    if (targetPath.length === 1) {
      // Siamo al penultimo livello
      if (ast.type === 'binary_op') {
        const direction = targetPath[0] as 'left' | 'right';
        const otherDirection = direction === 'left' ? 'right' : 'left';
        return ast[otherDirection];
      }
    }
    
    if (ast.type === 'binary_op') {
      const [first, ...rest] = targetPath;
      if (first === 'left') {
        const newLeft = removeNodeFromAST(ast.left, rest);
        return newLeft ? { ...ast, left: newLeft } : ast.right;
      } else {
        const newRight = removeNodeFromAST(ast.right, rest);
        return newRight ? { ...ast, right: newRight } : ast.left;
      }
    }
    
    return ast;
  };

  // Aggiunge un nodo all'AST
  const addNodeToAST = (ast: ASTNode, newNode: ASTNode): ASTNode => {
    // Strategia semplice: aggiungiamo sempre con un'operazione +
    return createBinaryOp('+', ast, newNode);
  };

  // Renderizza un nodo AST
  const renderNode = (node: ASTNode, side: 'left' | 'right', isFirst: boolean = true): React.ReactNode => {
    if (node.type === 'variable') {
      const coeff = node.coefficient;
      let display = '';
      
      if (coeff === 1) {
        display = isFirst ? 'x' : '+x';
      } else if (coeff === -1) {
        display = '-x';
      } else if (coeff > 0) {
        display = isFirst ? `${coeff}x` : `+${coeff}x`;
      } else {
        display = `${coeff}x`;
      }

      return (
        <span
          key={node.id}
          draggable
          onDragStart={(e) => handleDragStart(e, node, [], side)}
          className="bg-purple-200 hover:bg-purple-300 px-3 py-1 rounded cursor-move border border-purple-400 transition-colors inline-block mx-1"
        >
          {display}
        </span>
      );
    } else if (node.type === 'constant') {
      const value = node.value;
      const display = isFirst ? `${value}` : value >= 0 ? `+${value}` : `${value}`;

      return (
        <span
          key={node.id}
          draggable
          onDragStart={(e) => handleDragStart(e, node, [], side)}
          className="bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded cursor-move border border-yellow-400 transition-colors inline-block mx-1"
        >
          {display}
        </span>
      );
    } else {
      // binary_op
      const leftRender = renderNode(node.left, side, isFirst);
      const rightRender = renderNode(node.right, side, false);
      
      return (
        <React.Fragment key={node.id}>
          {leftRender}
          {rightRender}
        </React.Fragment>
      );
    }
  };

  // Gestore drag start
  const handleDragStart = (e: React.DragEvent, node: ASTNode, path: string[], side: 'left' | 'right') => {
    setDraggedNode({ node, parentPath: path, side });
    e.dataTransfer.effectAllowed = 'move';
  };

  // Gestore drop
  const handleDrop = (e: React.DragEvent, targetSide: 'left' | 'right') => {
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

  // Controlla se il gioco è vinto
  const checkWin = (eq: Equation): boolean => {
    const leftLeaves = getLeafNodes(eq.left);
    const rightLeaves = getLeafNodes(eq.right);
    
    const leftHasVariables = leftLeaves.some(leaf => leaf.node.type === 'variable');
    const leftHasConstants = leftLeaves.some(leaf => leaf.node.type === 'constant');
    const rightHasVariables = rightLeaves.some(leaf => leaf.node.type === 'variable');
    const rightHasConstants = rightLeaves.some(leaf => leaf.node.type === 'constant');

    // Vinto se le variabili sono tutte da una parte e le costanti dall'altra
    return (leftHasVariables && !leftHasConstants && rightHasConstants && !rightHasVariables) ||
           (rightHasVariables && !rightHasConstants && leftHasConstants && !leftHasVariables);
  };

  // Controlla vittoria quando l'equazione cambia
  useEffect(() => {
    if (equation) {
      setGameWon(checkWin(equation));
    }
  }, [equation]);

  const newGame = () => {
    setEquation(generateEquation());
    setGameWon(false);
  };

  if (!equation) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          🧮 Gioco delle Equazioni (AST)
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Trascina i termini per risolvere l'equazione!
          </h2>
          
          <div className="flex items-center justify-center space-x-8 text-2xl font-mono">
            {/* Lato sinistro */}
            <div 
              className="min-h-16 min-w-48 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-wrap items-center justify-center"
              onDrop={(e) => handleDrop(e, 'left')}
              onDragOver={handleDragOver}
            >
              {renderNode(equation.left, 'left')}
            </div>

            {/* Segno uguale */}
            <div className="text-3xl font-bold text-gray-600">=</div>

            {/* Lato destro */}
            <div 
              className="min-h-16 min-w-48 bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4 flex flex-wrap items-center justify-center"
              onDrop={(e) => handleDrop(e, 'right')}
              onDragOver={handleDragOver}
            >
              {renderNode(equation.right, 'right')}
            </div>
          </div>
        </div>

        {gameWon && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            <h3 className="text-xl font-bold">🎉 Complimenti! Hai risolto l'equazione!</h3>
            <p>Tutte le variabili sono da una parte e le costanti dall'altra.</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={newGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Nuova Equazione
          </button>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Come giocare:</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• <span className="bg-purple-200 px-2 py-1 rounded text-sm">Viola</span> = Variabili (x)</li>
            <li>• <span className="bg-yellow-200 px-2 py-1 rounded text-sm">Giallo</span> = Costanti (numeri)</li>
            <li>• Trascina i termini da un lato all'altro dell'equazione</li>
            <li>• Il segno cambierà automaticamente quando sposti un termine</li>
            <li>• Obiettivo: metti tutte le x da una parte e tutti i numeri dall'altra</li>
          </ul>
        </div>

        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Debug AST:</h4>
          <pre className="text-xs text-gray-500 overflow-auto">
            {JSON.stringify(equation, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EquationGame;