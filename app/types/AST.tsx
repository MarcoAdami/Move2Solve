export type ASTNode = 
  | { type: 'variable'; name: string; coefficient: number; id: string }
  | { type: 'constant'; coefficient: number; id: string }
  | { type: 'binary_op'; operator: '+' | '-'; left: ASTNode; right: ASTNode; id: string };

export interface Equation {
  left: ASTNode;
  right: ASTNode;
}

export interface DraggedNode {
  node: ASTNode;
  parentPath: string[];
  side: 'left' | 'right';
}

export interface LeafNode {
  node: ASTNode;
}

export type Side = 'left' | 'right';