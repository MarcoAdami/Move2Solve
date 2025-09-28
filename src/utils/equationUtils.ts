// Utilities for manipulating equations
import { Equation, ASTNode } from "@/src/types/ast";
import {
  createVariable,
  createConstant,
  combineNodes,
} from "@/src/utils/astUtils";

import { GameSettings } from "../types/game";

// Generates a list of random nodes
const generateRandomNodes = (
  count: number,
  type: "variable" | "constant"
): ASTNode[] => {
  const nodes: ASTNode[] = [];

  for (let i = 0; i < count; i++) {
    if (type === "variable") {
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

// Generates a new random equation with customizable parameters
export const generateEquation = (params?: GameSettings): Equation => {
  const { variablesCount = 1, constantsCount = 1 } = params || {};

  const alpha = Math.floor(Math.random() * variablesCount);
  const beta = Math.floor(Math.random() * constantsCount);

  // Generates nodes for the left side
  const leftVariables = generateRandomNodes(alpha, "variable");
  const leftConstants = generateRandomNodes(beta, "constant");
  const leftNodes = [...leftVariables, ...leftConstants];

  // Shuffles the nodes for a random order
  for (let i = leftNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [leftNodes[i], leftNodes[j]] = [leftNodes[j], leftNodes[i]];
  }

  // Generates nodes for the right side
  const rightVariables = generateRandomNodes(
    variablesCount - alpha,
    "variable"
  );
  const rightConstants = generateRandomNodes(constantsCount - beta, "constant");
  const rightNodes = [...rightVariables, ...rightConstants];

  // Shuffles the nodes for a random order
  for (let i = rightNodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightNodes[i], rightNodes[j]] = [rightNodes[j], rightNodes[i]];
  }
  const leftSide = combineNodes(leftNodes);
  const rightSide = combineNodes(rightNodes);

  return { left: leftSide, right: rightSide };
};
