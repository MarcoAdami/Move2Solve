// GameInstructions.tsx - Component for game instructions
import React from 'react';

export const GameInstructions: React.FC = () => {
  
  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">How to play</h3>
      <ul className="text-gray-600 space-y-2">
        <li>• <span className="bg-purple-200 px-2 py-1 rounded text-sm">Color 1</span> = Variables (x)</li>
        <li>• <span className="bg-yellow-200 px-2 py-1 rounded text-sm">Color 2</span> = Constants</li>
        <li>• Drag terms to combine them</li>
        <li>• Change the sign of a term when dragging it to the other side</li>
        <li>• Sum two terms by selecting them and clicking the "Combine" button or press "Enter"</li>
        <li>• Your goal is to simplify the equation as much as possible</li>
      </ul>
    </div>
  );
};