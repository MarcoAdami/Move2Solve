// gameLogic.ts - Logica di controllo del gioco

import { Equation } from '@/types/AST';
import { getLeafNodes } from '@/utils/astUtils';

// Controlla se il gioco è vinto
// TODO: checWin della soluzione effettiva
export const checkWin = (equation: Equation): boolean => {
  const leftLeaves = getLeafNodes(equation.left);
  const rightLeaves = getLeafNodes(equation.right);
  
  const leftHasVariables = leftLeaves.some(leaf => leaf.node.type === 'variable');
  const leftHasConstants = leftLeaves.some(leaf => leaf.node.type === 'constant');
  const rightHasVariables = rightLeaves.some(leaf => leaf.node.type === 'variable');
  const rightHasConstants = rightLeaves.some(leaf => leaf.node.type === 'constant');

  

  // Vinto se le variabili sono tutte da una parte e le costanti dall'altra
  return (leftHasVariables && !leftHasConstants && rightHasConstants && !rightHasVariables) ||
         (rightHasVariables && !rightHasConstants && leftHasConstants && !leftHasVariables);
};