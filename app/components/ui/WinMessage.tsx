// WinMessage.tsx - Component for the win message

import React from 'react';

interface WinMessageProps {
  isVisible: boolean;
}

export const WinMessage: React.FC<WinMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
      <h3 className="text-xl font-bold">You Win!</h3>
      <p>All variables are on one side and all constants are on the other side.</p>
    </div>
  );
};