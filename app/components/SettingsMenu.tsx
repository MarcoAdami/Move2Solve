// SettingsMenu.tsx - Menu delle impostazioni con slider

import React, { useState, useRef, useEffect } from 'react';

interface SettingsMenuProps {
  variablesCount: number;
  constantsCount: number;
  onVariablesChange: (count: number) => void;
  onConstantsChange: (count: number) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  variablesCount,
  constantsCount,
  onVariablesChange,
  onConstantsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Chiude il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      {/* Bottone per aprire/chiudere il menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 min-w-80">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Impostazioni Equazione</h3>
          
          {/* Slider per variabili */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Numero di Variabili: <span className="font-bold text-purple-600">{variablesCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={variablesCount}
              onChange={(e) => onVariablesChange(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
            />
          </div>

          {/* Slider per costanti */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Numero di Costanti: <span className="font-bold text-yellow-600">{constantsCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={constantsCount}
              onChange={(e) => onConstantsChange(parseInt(e.target.value))}
              className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider-yellow"
            />
          </div>

          <p className="text-xs text-gray-500 italic">
            Clicca "Nuova Equazione" per applicare le modifiche
          </p>
        </div>
      )}

      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-purple::-moz-range-thumb,
        .slider-yellow::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-purple::-moz-range-thumb {
          background: #8b5cf6;
        }
        
        .slider-yellow::-moz-range-thumb {
          background: #eab308;
        }
      `}</style>
    </div>
  );
};