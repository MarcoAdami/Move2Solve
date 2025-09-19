/**
 * Represents a single node in the Abstract Syntax Tree (AST).
 * It can be a variable, a constant, or a binary operation.
 */
export type ASTNode = 
  | { type: 'variable'; name: string; coefficient: number; id: string }
  | { type: 'constant'; coefficient: number; id: string }
  | { type: 'binary_op'; operator: '+' | '-'; left: ASTNode; right: ASTNode; id: string };

/**
 * Represents the full equation, composed of a left and a right side.
 */
export interface Equation {
  left: ASTNode;
  right: ASTNode;
}

/**
 * Defines the side of the equation.
 */
export type Side = 'left' | 'right';

/**
 * Represents the data of a node currently being dragged by the user.
 */
export interface DraggedNode {
  node: ASTNode;
  // The path to the node from the root of the AST.
  // This helps in locating the node within the tree structure.
  parentPath: string[]; 
  side: Side;
}

/**
 * Represents a node that has been selected by the user, including its side.
 */
export interface SelectedNode {
  node: ASTNode;
  side: Side;
}
