// SelectionPanel.tsx - Pannello per mostrare elementi selezionati

import React from 'react';
import { ASTNode, Side } from '@/types/AST';

interface SelectedNode {
  node: ASTNode;
  side: Side;
}

interface SelectionPanelProps {
  selectedNodes: SelectedNode[];
  onClearSelection: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedNodes,
  onClearSelection
}) => {
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

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
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
          <p className="text-xs text-gray-400 mt-1">
            Qui potrai fare operazioni con questi elementi
          </p>
        </div>
      )}
    </div>
  );
};