import { ASTNode, SelectedNode } from "../types/ast";
import { generateId } from "./astUtils";

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

//render selected node for proper display
export const renderSelectedNode = (
  selectedNode: SelectedNode,
  index: number
) => {
  const { node, side } = selectedNode;
  let display = "";
  let bgColor = "";

  if (node.type === "variable") {
    const coeff = node.coefficient;
    if (coeff === 1) {
      display = "x";
    } else if (coeff === -1) {
      display = "-x";
    } else {
      display = `${coeff}x`;
    }
    bgColor = "bg-purple-200 border-purple-400";
  } else if (node.type === "constant") {
    display = `${node.coefficient}`;
    bgColor = "bg-yellow-200 border-yellow-400";
  }

  // const sideColor = side === "left" ? "text-blue-600" : "text-green-600";
  // const sideText = side === "left" ? "SX" : "DX";

  return (
    <div key={`${node.id}-${index}`} className="flex items-center space-x-2">
      <span
        className={`${bgColor} px-2 py-1 rounded border text-sm font-medium`}
      >
        {display}
      </span>
      {/* <span className={`text-xs ${sideColor} font-medium`}>({sideText})</span> */}
    </div>
  );
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
