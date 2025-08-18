// equationGenerator.ts - Generatore di equazioni casuali (Updated)

import { Equation, ASTNode } from '@/types/AST';
import { createVariable, createConstant, createBinaryOp } from '@/utils/astUtils';

interface EquationParams {
  variablesCount: number;
  constantsCount: number;
}

// Genera una lista di nodi casuali
const generateRandomNodes = (count: number, type: 'variable' | 'constant'): ASTNode[] => {
  const nodes: ASTNode[] = [];
  
  for (let i = 0; i < count; i++) {
    if (type === 'variable') {
      // Coefficienti da -5 a 5, escluso 0
      let coeff = Math.floor(Math.random() * 11) - 5;
      if (coeff === 0) coeff = 1;
      nodes.push(createVariable(coeff));
    } else {
      // Costanti da -10 a 10, escluso 0
      let value = Math.floor(Math.random() * 21) - 10;
      if (value === 0) value = 1;
      nodes.push(createConstant(value));
    }
  }
  
  return nodes;
};

// Combina una lista di nodi in un singolo AST con operazioni binarie
const combineNodes = (nodes: ASTNode[]): ASTNode => {
  if (nodes.length === 0) throw new Error('Cannot combine empty node list');
  if (nodes.length === 1) return nodes[0];
  
  let result = nodes[0];
  for (let i = 1; i < nodes.length; i++) {
    // Alterna tra + e - per rendere le equazioni più interessanti
    const operator = Math.random() > 0.3 ? '+' : '-';
    result = createBinaryOp(operator, result, nodes[i]);
  }
  
  return result;
};

// Genera una nuova equazione casuale con parametri personalizzabili
export const generateEquation = (params?: EquationParams): Equation => {
  const { variablesCount = 1, constantsCount = 1 } = params || {};
  
  // Genera nodi per il lato sinistro
  const leftVariables = generateRandomNodes(variablesCount, 'variable');
  const leftConstants = generateRandomNodes(constantsCount, 'constant');
  const leftNodes = [...leftVariables, ...leftConstants];
  
  // Mescola i nodi per un ordine casuale
  for (let i = leftNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [leftNodes[i], leftNodes[j]] = [leftNodes[j], leftNodes[i]];
  }
  
  // Genera nodi per il lato destro
  const rightVariables = generateRandomNodes(variablesCount, 'variable');
  const rightConstants = generateRandomNodes(constantsCount, 'constant');
  const rightNodes = [...rightVariables, ...rightConstants];
  
  // Mescola i nodi per un ordine casuale
  for (let i = rightNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightNodes[i], rightNodes[j]] = [rightNodes[j], rightNodes[i]];
  }
  
  // Combina i nodi in AST
  const leftSide = combineNodes(leftNodes);
  const rightSide = combineNodes(rightNodes);
  
  return { left: leftSide, right: rightSide };
};

// Mantieni la funzione originale per compatibilità
export const generateSimpleEquation = (): Equation => {
  return generateEquation({ variablesCount: 1, constantsCount: 1 });
};