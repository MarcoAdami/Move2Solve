// GameInstructions.tsx - Component for game instructions
import React from 'react';

export const GameInstructions: React.FC = () => {
  return (
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
  );
};