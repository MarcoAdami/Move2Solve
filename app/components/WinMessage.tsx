// WinMessage.tsx - Component for the win message

import React from 'react';
import { useTranslation } from 'next-i18next';

interface WinMessageProps {
  isVisible: boolean;
}

export const WinMessage: React.FC<WinMessageProps> = ({ isVisible }) => {
  const { t } = useTranslation('common'); // Init translation hook
  if (!isVisible) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
      <h3 className="text-xl font-bold">{t('winMessageTitle')}</h3>
      <p>Tutte le variabili sono da una parte e le costanti dall'altra.</p>
    </div>
  );
};