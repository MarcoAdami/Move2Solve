// components/GameBoard.tsx
"use client";
import React from "react";
import { useGame } from "@/app/contexts/GameContext";
import { useSelection } from "@/app/contexts/SelectionContext";
import { useDragAndDrop } from "@/app/hooks/useDragAndDrop";
import { useCombineNodes } from "@/app/hooks/useCombineNodes";

// Import components
import { EquationSide } from "@/app/components/equation/EquationSide";
import { WinMessage } from "@/app/components/ui/WinMessage";
import { GameInstructions } from "@/app/components/ui/GameInstructions";
import { DebugPanel } from "@/app/components/ui/DebugPanel";
import { SettingsMenu } from "@/app/components/game/SettingsMenu";
import { SelectionPanel } from "@/app/components/ui/SelectionPanel";

export const GameBoard: React.FC = () => {
  const { equation, gameWon, resetGame, settings, updateSettings } = useGame();
  const { selectNode, getSelectedNodeIds, clearSelection } = useSelection();
  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();
  const { handleCombineNodes, selectedNodes } = useCombineNodes();

  if (!equation) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Settings menu */}
      <SettingsMenu
        settings = {settings}
        onVariablesChange={(count) => updateSettings({ variablesCount: count })}
        onConstantsChange={(count) => updateSettings({ constantsCount: count })}
      />

      <div className="max-w mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          🧮 Equation Game (AST)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-left space-x-8 text-2xl font-mono">
            {/* Left side */}
            <EquationSide
              ast={equation.left}
              side="left"
              selectedNodeIds={getSelectedNodeIds()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onNodeSelect={selectNode}
            />

            {/* Equal sign */}
            <div className="text-3xl font-bold text-gray-600">=</div>

            {/* Right side */}
            <EquationSide
              ast={equation.right}
              side="right"
              selectedNodeIds={getSelectedNodeIds()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onNodeSelect={selectNode}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Selection panel */}
          <SelectionPanel
            selectedNodes={selectedNodes}
            onClearSelection={clearSelection}
            onCombineNodes={handleCombineNodes}
          />
        </div>

        <WinMessage isVisible={gameWon} />

        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            New Equation
          </button>
        </div>

        <GameInstructions />

        <DebugPanel equation={equation} />
      </div>
    </div>
  );
};
