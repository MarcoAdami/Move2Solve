// hooks/useCombineNodes.tsx
"use client";
import { useGame } from "@/app/contexts/GameContext";
import { useSelection } from "@/app/contexts/SelectionContext";
import { ASTNode, LeafNode } from "@/app/types/ast";
import { getLeafNodes, combineNodes } from "@/app/utils/astUtils";
import { calculateCorrectResult } from "../utils/selectionUtils";

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

    //Parse the remaining nodes and do not inlcude the selected ones
    const remainingNodes = leafNodes.filter(
      (leaf) => !selectedIds.includes(leaf.id)
    );

    //Calculate the result of selected nodes
    const resultNode = calculateCorrectResult(selectedNodes);
    if (resultNode === undefined || resultNode === null) {
      throw new Error();
    }
    remainingNodes.forEach(node => {if(!(node as LeafNode)){
      throw new Error;
    }});
    // @ts-expect-error this line gives me a warning that is useless in my opinion
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
