// components/SelectionPanel.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ASTNode, Side } from "@/app/types/ast";
import { SelectedNode } from "@/app/types/ast";

interface SelectionPanelProps {
  selectedNodes: SelectedNode[];
  onClearSelection: () => void;
  onCombineNodes: (result: ASTNode) => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedNodes,
  onClearSelection,
  onCombineNodes,
}) => {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Clears input and feedback when selections change
  // FIXME: uptade selection also in other cases (such as new equation)
  useEffect(() => {
    setUserInput("");
    setFeedback({ type: null, message: "" });
  }, [selectedNodes]);

  // if (selectedNodes.length === 0) return null;

  //render selected node for proper display
  const renderSelectedNode = (selectedNode: SelectedNode, index: number) => {
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

  // Calculates the correct result of the operation
  const calculateCorrectResult = (): {
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
  const validateUserInput = (input: string): boolean => {
    const correctResult = calculateCorrectResult();
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
  const createResultNode = (): ASTNode | null => {
    const correctResult = calculateCorrectResult();
    if (!correctResult) return null;

    const generateId = (): string =>
      `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

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

  // Handles the Enter key press
  //REVIEW:  there is no space to show it, meaningfull for feedback
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateUserInput(userInput)) {
        const resultNode = createResultNode();
        if (resultNode && onCombineNodes) {
          setFeedback({
            type: "success",
            message: "✅ Right! Operation applied.",
          });
          setTimeout(() => {
            onCombineNodes(resultNode);
            setFeedback({ type: null, message: "" });
          }, 200);
        }
      } else {
        setFeedback({
          type: "error",
          message: "❌ Wrong. Try again!",
        });
        setTimeout(() => setFeedback({ type: null, message: "" }), 3000);
      }
    }
  };

  // Shows the operation to be performed
  //REVIEW: understan if this function could be useful in the future
  const getOperationDisplay = (): string => {
    if (selectedNodes.length !== 2) return "";

    const [first, second] = selectedNodes;
    let firstDisplay = "";
    let secondDisplay = "";

    if (first.node.type === "binary_op" || second.node.type === "binary_op") {
      return "";
    }

    if (first.node.type === "variable") {
      const coeff = first.node.coefficient;
      firstDisplay = coeff === 1 ? "x" : coeff === -1 ? "-x" : `${coeff}x`;
    } else {
      firstDisplay = `${first.node.coefficient}`;
    }

    if (second.node.type === "variable") {
      const coeff = second.node.coefficient;
      secondDisplay = coeff === 1 ? "x" : coeff === -1 ? "-x" : `${coeff}x`;
    } else {
      secondDisplay = `${second.node.coefficient}`;
    }

    return `${firstDisplay} + ${secondDisplay} = `;
  };

  return (
    <div>
      <div className="flex gap-2">
        <h4 className="text-xl font-semibold text-gray-700">
          Selected Elements:
        </h4>
        {selectedNodes.map((selectedNode, index) =>
          renderSelectedNode(selectedNode, index)
        )}
      </div>

      <div className="flex gap-2">
        <h4 className="text-xl font-semibold text-gray-700">Result:</h4>
        {/* REVIEW: not the best looking way to loading it, but it works:) */}
        {selectedNodes.length > 1 && (
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write the result and press Enter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
        )}
      </div>
    </div>
  );
};
