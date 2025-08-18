// EquationSide.tsx - Componente per i lati dell'equazione (Updated)

import React from 'react';
import { ASTNode, Side } from '@/types/AST';
import { ASTNodeComponent } from './ASTNodeComponents';

interface EquationSideProps {
  ast: ASTNode;
  side: Side;
  selectedNodeIds: string[];
  onDrop: (e: React.DragEvent, targetSide: Side) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, node: ASTNode, path: string[], side: Side) => void;
  onNodeSelect?: (node: ASTNode, side: Side) => void;
}

// Funzione helper per controllare se un nodo è selezionato
const isNodeSelected = (node: ASTNode, selectedIds: string[]): boolean => {
  return selectedIds.includes(node.id);
};

// Funzione helper per ottenere tutti gli ID dei nodi nell'AST
const getAllNodeIds = (node: ASTNode): string[] => {
  if (node.type === 'variable' || node.type === 'constant') {
    return [node.id];
  } else {
    return [node.id, ...getAllNodeIds(node.left), ...getAllNodeIds(node.right)];
  }
};

export const EquationSide: React.FC<EquationSideProps> = ({
  ast,
  side,
  selectedNodeIds,
  onDrop,
  onDragOver,
  onDragStart,
  onNodeSelect
}) => {
  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, side);
  };

  const sideClass = side === 'left' 
    ? 'bg-blue-50 border-blue-300' 
    : 'bg-green-50 border-green-300';

  // Controlliamo se qualsiasi nodo di questo AST è selezionato
  const allNodeIds = getAllNodeIds(ast);
  const hasSelection = allNodeIds.some(id => selectedNodeIds.includes(id));

  return (
    <div 
      className={`min-h-16 min-w-48 ${sideClass} border-2 border-dashed rounded-lg p-4 flex flex-wrap items-center justify-center ${
        hasSelection ? 'ring-2 ring-indigo-300 ring-opacity-50' : ''
      } transition-all duration-200`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      <ASTNodeComponent 
        node={ast} 
        side={side} 
        isSelected={isNodeSelected(ast, selectedNodeIds)}
        onDragStart={onDragStart}
        onNodeSelect={onNodeSelect}
      />
    </div>
  );
};