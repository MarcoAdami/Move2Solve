// contexts/GameContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Equation } from "@/app/types/ast";
import { generateEquation } from "@/app/utils/equationUtils";
import { checkWin } from "@/app/components/GameLogic";

interface GameSettings {
  variablesCount: number;
  constantsCount: number;
}

interface GameContextType {
  equation: Equation | null;
  setEquation: (equation: Equation) => void;
  gameWon: boolean;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [equation, setEquation] = useState<Equation | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    variablesCount: 2,
    constantsCount: 2,
  });

  // Initialize game
  useEffect(() => {
    if (!equation) {
      setEquation(generateEquation(settings));
    }
  }, [settings]);

  // Check for win condition whenever equation changes
  useEffect(() => {
    if (equation) {
      setGameWon(checkWin(equation));
    }
  }, [equation]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetGame = () => {
    setEquation(generateEquation(settings));
    setGameWon(false);
  };

  return (
    <GameContext.Provider
      value={{
        equation,
        setEquation,
        gameWon,
        settings,
        updateSettings,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
