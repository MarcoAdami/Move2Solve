// gameLogic.ts - Game control logic

import { Equation } from "@/app/types/ast";
import { getLeafNodes } from "@/app/utils/astUtils";

// Win: when all sums are solved
export const checkWin = (equation: Equation): boolean => {
  const leftLeaves = getLeafNodes(equation.left);
  const rightLeaves = getLeafNodes(equation.right);

  // const leftValueVariables = leftLeaves.reduce((acc, curr) => acc + (curr.node.type === 'variable' ? curr.node.coefficient : 0), 0);
  // const leftValueCostant = leftLeaves.reduce((acc, curr) => acc + (curr.node.type === 'constant' ? curr.node.coefficient : 0), 0);
  // const rightValueVariables = rightLeaves.reduce((acc, curr) => acc + (curr.node.type === 'variable' ? curr.node.coefficient : 0), 0);
  // const rightValueCostant = rightLeaves.reduce((acc, curr) => acc + (curr.node.type === 'constant' ? curr.node.coefficient : 0), 0);

  // const leftSolution = leftValueVariables - rightValueVariables;
  // const rightSolution  = rightValueCostant - leftValueCostant;

  // Win if all variables are on one side and all constants are on the other
  return rightLeaves.length === 1 && leftLeaves.length === 1;
};
