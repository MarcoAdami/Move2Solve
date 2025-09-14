// Utilities for manipulating the Abstract Syntax Tree

import { ASTNode, Equation, LeafNode } from "@/app/types/ast";

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
export const createBinaryOp = (
  operator: "+" | "-",
  left: ASTNode,
  right: ASTNode
): ASTNode => ({
  type: "binary_op",
  operator,
  left,
  right,
  id: generateId(),
});

// CLONE - one node of the AST maintaing the same ID
export const cloneNode = (node: ASTNode): ASTNode => {
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
export const getLeafNodes = (node: ASTNode): LeafNode[] => {
  if (node.type === "variable" || node.type === "constant") {
    return [{ node }];
  } else {
    return [...getLeafNodes(node.left), ...getLeafNodes(node.right)];
  }
};

// REMOVE - one node of the AST give its path
export const removeNodeFromAST = (
  ast: ASTNode,
  targetPath: string[]
): ASTNode | null => {
  if (targetPath.length === 0) return null;

  if (targetPath.length === 1) {
    // Siamo al penultimo livello
    if (ast.type === "binary_op") {
      const direction = targetPath[0] as "left" | "right";
      const otherDirection = direction === "left" ? "right" : "left";
      return ast[otherDirection];
    }
  }

  if (ast.type === "binary_op") {
    const [first, ...rest] = targetPath;
    if (first === "left") {
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
// ADD - node to AST
export const addNodeToAST = (ast: ASTNode, newNode: ASTNode): ASTNode => {
  // Strategia semplice: aggiungiamo sempre con un'operazione +
  return createBinaryOp("+", ast, newNode);
};

// COMBINES - a list of nodes into a single AST with binary operations
export const combineNodes = (nodes: ASTNode[]): ASTNode => {
  if (nodes.length === 0) throw new Error("Cannot combine empty node list");
  if (nodes.length === 1) return nodes[0];

  let result = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    // Alternates between + and - to make the equations more interesting
    const operator = "+";
    result = createBinaryOp(operator, result, nodes[i]);
  }

  return result;
};
