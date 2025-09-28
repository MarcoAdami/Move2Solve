// components/EquationGame.tsx
"use client";
import React from "react";
import { GameProvider } from "@/src/contexts/GameContext";
import { SelectionProvider } from "@/src/contexts/SelectionContext";
import { GameBoard } from "./GameBoard";

const EquationGame: React.FC = () => {
  return (
    <GameProvider>
      <SelectionProvider>
        <GameBoard />
      </SelectionProvider>
    </GameProvider>
  );
};

export default EquationGame;
