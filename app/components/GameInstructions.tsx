// GameInstructions.tsx - Component for game instructions
import React from 'react';
import { useTranslation } from 'next-i18next';

export const GameInstructions: React.FC = () => {

  const { t } = useTranslation('common'); // Init translation hook
  
  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('howToPlayTitle')}</h3>
      <ul className="text-gray-600 space-y-2">
        <li>• <span className="bg-purple-200 px-2 py-1 rounded text-sm">{t('color1')}</span> = {t('varaibles')} (x)</li>
        <li>• <span className="bg-yellow-200 px-2 py-1 rounded text-sm">{t('color2')}</span> = {t('constans')}</li>
        <li>• {t('dragTerms')}</li>
        <li>• {t('signChange')}</li>
        <li>• {t('sumAction')}</li>
        <li>• {t('objective')}</li>
      </ul>
    </div>
  );
};