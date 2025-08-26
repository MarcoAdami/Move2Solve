// equationGenerator.ts - Random equation generator (Updated)

import { Equation, ASTNode } from '@/types/AST';
import { createVariable, createConstant, createBinaryOp } from '@/utils/astUtils';

interface EquationParams {
  variablesCount: number;
  constantsCount: number;
}

// Generates a list of random nodes
const generateRandomNodes = (count: number, type: 'variable' | 'constant'): ASTNode[] => {
  const nodes: ASTNode[] = [];
  
  for (let i = 0; i < count; i++) {
    if (type === 'variable') {
      // Coefficients from -5 to 5, excluding 0
      let coeff = Math.floor(Math.random() * 11) - 5;
      if (coeff === 0) coeff = 1;
      nodes.push(createVariable(coeff));
    } else {
      // Constants from -10 to 10, excluding 0
      let value = Math.floor(Math.random() * 21) - 10;
      if (value === 0) value = 1;
      nodes.push(createConstant(value));
    }
  }
  
  return nodes;
};

// Combines a list of nodes into a single AST with binary operations
const combineNodes = (nodes: ASTNode[]): ASTNode => {
  if (nodes.length === 0) throw new Error('Cannot combine empty node list');
  if (nodes.length === 1) return nodes[0];
  
  let result = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    // Alternates between + and - to make the equations more interesting
    const operator = '+';
    result = createBinaryOp(operator, result, nodes[i]);
  }
  
  return result;
};

// Generates a new random equation with customizable parameters
export const generateEquation = (params?: EquationParams): Equation => {
  const { variablesCount = 1, constantsCount = 1 } = params || {};
  
  const alpha = Math.floor(Math.random()*variablesCount);
  const beta = Math.floor(Math.random()*constantsCount);
  

  // Generates nodes for the left side
  const leftVariables = generateRandomNodes(alpha, 'variable');
  const leftConstants = generateRandomNodes(beta, 'constant');
  const leftNodes = [...leftVariables, ...leftConstants];
  
  // Shuffles the nodes for a random order
  for (let i = leftNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [leftNodes[i], leftNodes[j]] = [leftNodes[j], leftNodes[i]];
  }
  
  // Generates nodes for the right side
  const rightVariables = generateRandomNodes(variablesCount - alpha, 'variable');
  const rightConstants = generateRandomNodes(constantsCount - beta, 'constant');
  const rightNodes = [...rightVariables, ...rightConstants];
  
  // Shuffles the nodes for a random order
  for (let i = rightNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightNodes[i], rightNodes[j]] = [rightNodes[j], rightNodes[i]];
  }
  
  // Combines the nodes into an AST
  if(leftNodes.length === 0){
    leftNodes.push(rightNodes[rightNodes.length-1]);
    rightNodes.pop();
  }

  if(rightNodes.length === 0){
    rightNodes.push(rightNodes[rightNodes.length-1]);
    leftNodes.pop();
  }
  const leftSide = combineNodes(leftNodes);
  const rightSide = combineNodes(rightNodes);
  
  return { left: leftSide, right: rightSide };
};

// Keeps the original function for compatibility
export const generateSimpleEquation = (): Equation => {
  return generateEquation({ variablesCount: 1, constantsCount: 1 });
};