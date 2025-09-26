// hooks/useCombineNodes.tsx
"use client";
import { useGame } from "@/app/contexts/GameContext";
import { useSelection } from "@/app/contexts/SelectionContext";
import { ASTNode, LeafNode } from "@/app/types/ast";
import { getLeafNodes, combineNodes } from "@/app/utils/astUtils";
import { createResultNode } from "../utils/selectionUtils"; // Cambiato da calculateCorrectResult

export const useCombineNodes = () => {
  const { equation, setEquation } = useGame();
  const { selectedNodes, clearSelection } = useSelection();

  const handleCombineNodes = () => {
    if (!equation || selectedNodes.length !== 2) return;

    // Find the side where the selected nodes are (they are all on the same side)
    const targetSide = selectedNodes[0].side;
    const targetAST = equation[targetSide];

    // Remove the two selected nodes and add the result
    const leafNodes = getLeafNodes(targetAST);

    //Get the id of the selected nodes
    const selectedIds = selectedNodes.map((s) => s.node.id);

    //Parse the remaining nodes and do not include the selected ones
    const remainingNodes = leafNodes.filter(
      (leaf) => !selectedIds.includes(leaf.id)
    );

    //Calculate the result of selected nodes using createResultNode
    const resultNode = createResultNode(selectedNodes);
    if (resultNode === null) {
      throw new Error("Unable to create result node");
    }
    
    let newAST: ASTNode = combineNodes([...remainingNodes, resultNode]);

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