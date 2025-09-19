import { ASTNode, SelectedNode } from "../types/ast";
import { generateId } from "./astUtils";


// Helper function to check if a node is selected
export const isNodeSelected = (node: ASTNode, selectedIds: string[]): boolean => {
  return selectedIds.includes(node.id);
};

// Helper function to get all node IDs in the AST
export const getAllNodeIds = (node: ASTNode): string[] => {
  if (node.type === "variable" || node.type === "constant") {
    return [node.id];
  }else {
    return [node.id, ...getAllNodeIds(node.left), ...getAllNodeIds(node.right)];
  }
};

// Calculates the correct result of the operation
export const calculateCorrectResult = (
  selectedNodes: SelectedNode[]
): {
  value: number;
  type: "variable" | "constant";
} | null => {
  if (selectedNodes.length !== 2) return null;

  const [first, second] = selectedNodes;

  // If node is type 'binary_op' operation invalid
  if (first.node.type === "binary_op" || second.node.type === "binary_op") {
    return null;
  }

  // Must be the same type
  if (first.node.type !== second.node.type) return null;

  if (first.node.type === "variable") {
    return {
      value: first.node.coefficient + second.node.coefficient,
      type: "variable",
    };
  } else {
    return {
      value: first.node.coefficient + second.node.coefficient,
      type: "constant",
    };
  }
};

// Check user input
export const validateUserInput = (input: string, selectedNodes: SelectedNode[]): boolean => {
  const correctResult = calculateCorrectResult(selectedNodes);
  if (!correctResult) return false;

  // Clear input
  const cleanInput = input.trim().toLowerCase();

  if (correctResult.type === "variable") {
    // Variables accepted format: "5x", "-3x", "x", "-x"
    if (cleanInput === "x" || cleanInput === "+x") {
      return correctResult.value === 1;
    } else if (cleanInput === "-x") {
      return correctResult.value === -1;
    } else if (cleanInput.endsWith("x")) {
      const coeffStr = cleanInput.slice(0, -1);
      const coeff =
        coeffStr === "" || coeffStr === "+"
          ? 1
          : coeffStr === "-"
          ? -1
          : parseInt(coeffStr);
      return !isNaN(coeff) && coeff === correctResult.value;
    }
    return false;
  } else {
    // For constants: a simple number
    const value = parseInt(cleanInput);
    return !isNaN(value) && value === correctResult.value;
  }
};



// Creates the result node
export const createResultNode = (selectedNodes: SelectedNode[]): ASTNode | null => {
    const correctResult = calculateCorrectResult(selectedNodes);
    if (!correctResult) return null;

    if (correctResult.type === "variable") {
      return {
        type: "variable",
        name: "x",
        coefficient: correctResult.value,
        id: generateId(),
      };
    } else {
      return {
        type: "constant",
        coefficient: correctResult.value,
        id: generateId(),
      };
    }
  };
