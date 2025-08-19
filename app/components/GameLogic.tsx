// gameLogic.ts - Logica di controllo del gioco

import { Equation } from '@/types/AST';
import { getLeafNodes } from '@/utils/astUtils';

// Win: when all sum are solved
export const checkWin = (equation: Equation): boolean => {
  const leftLeaves = getLeafNodes(equation.left);
  const rightLeaves = getLeafNodes(equation.right);

  // const leftValueVariables = leftLeaves.reduce((acc, curr) => acc + (curr.node.type === 'variable' ? curr.node.coefficient : 0), 0);
  // const leftValueCostant = leftLeaves.reduce((acc, curr) => acc + (curr.node.type === 'constant' ? curr.node.coefficient : 0), 0);
  // const rightValueVariables = rightLeaves.reduce((acc, curr) => acc + (curr.node.type === 'variable' ? curr.node.coefficient : 0), 0);
  // const rightValueCostant = rightLeaves.reduce((acc, curr) => acc + (curr.node.type === 'constant' ? curr.node.coefficient : 0), 0);

  // const leftSolution = leftValueVariables - rightValueVariables;
  // const rightSolution  = rightValueCostant - leftValueCostant;

  // Vinto se le variabili sono tutte da una parte e le costanti dall'altra
  return (rightLeaves.length === 1 && leftLeaves.length === 1);
};