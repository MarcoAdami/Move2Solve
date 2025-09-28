// Utilities for manipulating the Abstract Syntax Tree

import { ASTNode } from "@/src/types/ast";

// GENERATE - unique ID
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// CREATE - variable node
export const createVariable = (coefficient: number): ASTNode => ({
  type: "variable",
  name: "x",
  coefficient,
  id: generateId(),
});

// CREATE - costant node
export const createConstant = (coefficient: number): ASTNode => ({
  type: "constant",
  coefficient,
  id: generateId(),
});

// CREATE - Binary operands node
const createBinaryOp = (
  operator: "+",
  left: ASTNode,
  right: ASTNode
): ASTNode => ({
  type: "binary_op",
  operator,
  left,
  right,
  id: generateId(),
});

// CLONE - one node of the AST maintaining the same ID
const cloneNode = (node: ASTNode): ASTNode => {
  if (node.type === "variable" || node.type === "constant") {
    return { ...node };
  } else {
    return {
      ...node,
      left: cloneNode(node.left),
      right: cloneNode(node.right),
    };
  }
};

// CHANGE - sign of a node
export const changeSign = (node: ASTNode): ASTNode => {
  const cloned = cloneNode(node);

  if (cloned.type === "variable" || cloned.type === "constant") {
    return { ...cloned, coefficient: -cloned.coefficient };
  } else {
    return { ...cloned };
  }
};

// FIND - every draggable node
export const getLeafNodes = (node: ASTNode): ASTNode[] => {
  if (node.type === "variable" || node.type === "constant") {
    return [node];
  } else {
    return [...getLeafNodes(node.left), ...getLeafNodes(node.right)];
  }
};

// ADD - node to AST
export const addNodeToAST = (ast: ASTNode, newNode: ASTNode): ASTNode => {
  // Strategia semplice: aggiungiamo sempre con un'operazione +
  return createBinaryOp("+", ast, newNode);
};

// COMBINES - a list of nodes into a single AST with binary operations
export const combineNodes = (nodes: ASTNode[]): ASTNode => {
  if (nodes.length === 0) throw new Error("Cannot combine empty node list");
  if (nodes.length === 1) return nodes[0];

  // Creiamo una copia dell'array per non modificare l'originale
  let workingNodes = [...nodes];

  while (workingNodes.length > 1) {
    // Se abbiamo un numero dispari di nodi, combiniamo gli ultimi due
    if (workingNodes.length % 2 === 1) {
      const last1 = workingNodes.pop();
      const last2 = workingNodes.pop();
      if (last1 === undefined || last2 === undefined) {
        throw new Error("Unexpected undefined node");
      }
      workingNodes.push(addNodeToAST(last2, last1));
    }

    // Ora abbiamo un numero pari di nodi
    const newNodes: ASTNode[] = [];
    for (let i = 0; i < workingNodes.length; i += 2) {
      const first = workingNodes[i];
      const second = workingNodes[i + 1];
      if (first === undefined || second === undefined) {
        throw new Error("Unexpected undefined node");
      }
      newNodes.push(addNodeToAST(first, second));
    }
    workingNodes = newNodes;
  }

  return workingNodes[0];
};
