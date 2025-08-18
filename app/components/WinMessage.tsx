// WinMessage.tsx - Componente per il messaggio di vittoria

import React from 'react';

interface WinMessageProps {
  isVisible: boolean;
}

export const WinMessage: React.FC<WinMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
      <h3 className="text-xl font-bold">🎉 Complimenti! Hai risolto l'equazione!</h3>
      <p>Tutte le variabili sono da una parte e le costanti dall'altra.</p>
    </div>
  );
};