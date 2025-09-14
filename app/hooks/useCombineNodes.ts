// hooks/useCombineNodes.tsx
"use client";
import { useGame } from "@/app/contexts/GameContext";
import { useSelection } from "@/app/contexts/SelectionContext";
import { ASTNode } from "@/app/types/ast";
import { getLeafNodes, createBinaryOp } from "@/app/utils/astUtils";
import { SelectedNode } from "@/app/contexts/SelectionContext";

export const useCombineNodes = () => {
  const { equation, setEquation } = useGame();
  const { selectedNodes, clearSelection } = useSelection();

  const handleCombineNodes = (resultNode: ASTNode) => {
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
    clearSelection();
  };

  return {
    handleCombineNodes,
    selectedNodes,
  };
};
