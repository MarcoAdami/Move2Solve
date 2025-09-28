// hooks/useDragAndDrop.tsx
"use client";
import { useState } from "react";
import { ASTNode, Side, DraggedNode } from "@/src/types/ast";
import { useGame } from "@/src/contexts/GameContext";
import { changeSign, getLeafNodes, combineNodes } from "@/src/utils/astUtils";

export const useDragAndDrop = () => {
  const [draggedNode, setDraggedNode] = useState<DraggedNode | null>(null);
  const { equation, setEquation } = useGame();

  const handleDragStart = (
    e: React.DragEvent,
    node: ASTNode,
    path: string[],
    side: Side
  ) => {
    setDraggedNode({ node, parentPath: path, side });
    e.dataTransfer.effectAllowed = "move";
  };

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

    // Recreate the equation by removing and adding
    const leafNodes = getLeafNodes(sourceAST);
    const remainingNodes = leafNodes.filter(
      (leaf) => leaf.id !== draggedNode.node.id
    );

    let newSourceAST: ASTNode | null = null;
    if (remainingNodes.length > 0) {
      newSourceAST = combineNodes(remainingNodes);
    }

    // Add the node to the target side
    const targetAST = equation[targetSide];

    //Return list of the new side updated with the other node
    const newTargetAST = combineNodes([
      ...getLeafNodes(targetAST),
      nodeWithChangedSign,
    ]);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    draggedNode,
    handleDragStart,
    handleDrop,
    handleDragOver,
  };
};
