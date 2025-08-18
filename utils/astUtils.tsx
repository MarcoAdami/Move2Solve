// astUtils.tsx - Utilità per la manipolazione dell'Abstract Syntax Tree

import { ASTNode, Equation, LeafNode } from '@/types/AST';

// Genera un ID univoco
export const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// Crea un nodo variabile
export const createVariable = (coefficient: number): ASTNode => ({
  type: 'variable',
  name: 'x',
  coefficient,
  id: generateId()
});

// Crea un nodo costante
export const createConstant = (coefficient: number): ASTNode => ({
  type: 'constant',
  coefficient,
  id: generateId()
});

// Crea un nodo operazione binaria
export const createBinaryOp = (operator: '+' | '-', left: ASTNode, right: ASTNode): ASTNode => ({
  type: 'binary_op',
  operator,
  left,
  right,
  id: generateId()
});

// Clona un nodo AST mantenendo lo stesso ID
export const cloneNode = (node: ASTNode): ASTNode => {
  if (node.type === 'variable' || node.type === 'constant') {
    return { ...node};
  } else {
    return {
      ...node,
      left: cloneNode(node.left),
      right: cloneNode(node.right)
    };
  }
};

// Cambia il segno di un nodo
export const changeSign = (node: ASTNode): ASTNode => {
  const cloned = cloneNode(node);
  
  if (cloned.type === 'variable' || cloned.type === 'constant') {
    return { ...cloned, coefficient: -cloned.coefficient };
  }else{
    return {...cloned};
  }
};

// Trova tutti i nodi foglia (trascinabili) di un AST
export const getLeafNodes = (node: ASTNode, path: string[] = []): LeafNode[] => {
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
export const removeNodeFromAST = (ast: ASTNode, targetPath: string[]): ASTNode | null => {
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

// TODO: fare in modo di aggiungere anche altre operazioni
// Aggiunge un nodo all'AST
export const addNodeToAST = (ast: ASTNode, newNode: ASTNode): ASTNode => {
  // Strategia semplice: aggiungiamo sempre con un'operazione +
  return createBinaryOp('+', ast, newNode);
};
