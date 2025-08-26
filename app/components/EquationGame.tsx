"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';

// Import types
import { Equation, DraggedNode, ASTNode, Side } from "@/types/AST";

// Import utils
import {
  changeSign,
  getLeafNodes,
  addNodeToAST,
  createBinaryOp,
} from "@/utils/astUtils";

// Import game logic
import { generateEquation } from "./EquationGenerator";
import { checkWin } from "./GameLogic";

// Import components
import { EquationSide } from "./EquationSide";
import { WinMessage } from "./WinMessage";
import { GameInstructions } from "./GameInstructions";
import { DebugPanel } from "./DebugPanel";
import { SettingsMenu } from "./SettingsMenu";
import { SelectionPanel } from "./SelectionPanel";

// Selection interface
interface SelectedNode {
  node: ASTNode;
  side: Side;
}

const EquationGame: React.FC = () => {

  const { t } = useTranslation('common'); // Init translation hook

  const [equation, setEquation] = useState<Equation | null>(null);
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);
  const [gameWon, setGameWon] = useState(false);

  // Initial state settings
  const [variablesCount, setVariablesCount] = useState<number>(2);
  const [constantsCount, setConstantsCount] = useState<number>(2);

  // Initial selection state
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);

  // Game init
  useEffect(() => {
    setEquation(generateEquation({ variablesCount, constantsCount }));
  }, []);

  // Drag start manager
  const handleDragStart = (
    e: React.DragEvent,
    node: ASTNode,
    path: string[],
    side: Side
  ) => {
    setDraggedNode({ node, parentPath: path, side });
    e.dataTransfer.effectAllowed = "move";
  };

  // Clear selection function
  const handleClearSelection = () => {
    setSelectedNodes([]);
  };

  // Selection node manager
  const handleNodeSelect = (node: ASTNode, side: Side) => {
    if (selectedNodes.length === 2) {
      handleClearSelection();
    }

    setSelectedNodes((prevSelected) => {
      // Filter selection based on rules
      let newSelected = prevSelected.filter((selected) => {
        // Types rule: if a different type is selected then remove the previous one
        if (selected.node.type !== node.type) {
          return false;
        }

        // Side rule: keep only those on the same side
        return selected.side === side;
      });

      // Check if the node is already selected
      const alreadySelected = newSelected.find(
        (selected) => selected.node.id === node.id
      );

      if (alreadySelected) {
        // If already selected, remove it
        newSelected = newSelected.filter(
          (selected) => selected.node.id !== node.id
        );
      } else {
        // If not selected, add it
        newSelected.push({ node, side });
      }

      return newSelected;
    });
  };

  // Function to combine selected terms
  const handleCombineNodes = (
    resultNode: ASTNode,
    selectedNodes: SelectedNode[]
  ) => {
    if (!equation || selectedNodes.length !== 2) return;

    // Find the side where the selected nodes are (they are all on the same side)
    const targetSide = selectedNodes[0].side;
    const targetAST = equation[targetSide];

    // Remove the two selected nodes and add the result
    const leafNodes = getLeafNodes(targetAST);
    const selectedIds = selectedNodes.map((s) => s.node.id);
    const remainingNodes = leafNodes.filter(
      (leaf) => !selectedIds.includes(leaf.node.id)
    );

    // FIXME: find a better way to delete and add nodes
    let newAST: ASTNode;
    if (remainingNodes.length === 0) {
      newAST = resultNode;
    } else {
      newAST = remainingNodes[0].node;
      for (let i = 1; i < remainingNodes.length; i++) {
        newAST = createBinaryOp("+", newAST, remainingNodes[i].node);
      }
      newAST = createBinaryOp("+", newAST, resultNode);
    }

    // Update the equation
    setEquation({
      ...equation,
      [targetSide]: newAST,
    });

    // Clear the selection
    setSelectedNodes([]);
  };

  // Drop handler
  const handleDrop = (e: React.DragEvent, targetSide: Side) => {
    e.preventDefault();

    if (!draggedNode || !equation) return;

    // If we drop on the same side, do nothing
    if (draggedNode.side === targetSide) {
      setDraggedNode(null);
      return;
    }

    // Change the sign of the node when we move it to the other side
    const nodeWithChangedSign = changeSign(draggedNode.node);

    // Remove the node from the original side
    const sourceSide = draggedNode.side;
    const sourceAST = equation[sourceSide];

    // For simplicity, we recreate the equation by removing and adding
    // FIXME: I think the removal can be done in a better way
    const leafNodes = getLeafNodes(sourceAST);
    const remainingNodes = leafNodes.filter(
      (leaf) => leaf.node.id !== draggedNode.node.id
    );

    let newSourceAST: ASTNode | null = null;
    if (remainingNodes.length > 0) {
      newSourceAST = remainingNodes[0].node;
      for (let i = 1; i < remainingNodes.length; i++) {
        newSourceAST = createBinaryOp(
          "+",
          newSourceAST,
          remainingNodes[i].node
        );
      }
    }

    // Add the node to the target side
    const targetAST = equation[targetSide];

    //
    const newTargetAST = addNodeToAST(targetAST, nodeWithChangedSign);

    // Update the equation
    if (newSourceAST) {
      setEquation({
        ...equation,
        [sourceSide]: newSourceAST,
        [targetSide]: newTargetAST,
      });
    }

    setDraggedNode(null);
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Check for win when the equation changes
  useEffect(() => {
    if (equation) {
      setGameWon(checkWin(equation));
    }
  }, [equation]);

  // New equation with current parameters
  const newGame = () => {
    setEquation(generateEquation({ variablesCount, constantsCount }));
    setGameWon(false);
    setSelectedNodes([]); // Clears the selection
  };

  // Get selected node IDs for highlighting
  const getSelectedNodeIds = (): string[] => {
    return selectedNodes.map((selected) => selected.node.id);
  };

  if (!equation) return <div>Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Settings menu */}
      <SettingsMenu
        variablesCount={variablesCount}
        constantsCount={constantsCount}
        onVariablesChange={setVariablesCount}
        onConstantsChange={setConstantsCount}
      />

      {/* Selection panel */}
      <SelectionPanel
        selectedNodes={selectedNodes}
        onClearSelection={handleClearSelection}
        onCombineNodes={handleCombineNodes} // <- Add this line
      />

      <div className="max-w mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          {t('gameTitle')}
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">

          <div className="flex items-center justify-center space-x-8 text-2xl font-mono">
            {/* Left side */}
            <EquationSide
              ast={equation.left}
              side="left"
              selectedNodeIds={getSelectedNodeIds()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onNodeSelect={handleNodeSelect}
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
              onNodeSelect={handleNodeSelect}
            />
          </div>
        </div>

        <WinMessage isVisible={gameWon} />

        <div className="text-center">
          <button
            onClick={newGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {t('newEquationButton')}
          </button>
        </div>

        <GameInstructions />

        <DebugPanel equation={equation} />
      </div>
    </div>
  );
};

export default EquationGame;