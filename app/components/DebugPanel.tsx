// DebugPanel.tsx - Componente per il debug dell'AST

import React from 'react';
import { Equation } from '@/types/AST';

interface DebugPanelProps {
  equation: Equation;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ equation }) => {
  return (
    <div className="mt-4 bg-gray-100 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">Debug AST:</h4>
      <pre className="text-xs text-gray-500 overflow-auto">
        {JSON.stringify(equation, null, 2)}
      </pre>
    </div>
  );
}