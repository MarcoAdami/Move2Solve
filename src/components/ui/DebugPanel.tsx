// DebugPanel.tsx - Component for AST debugging

import React from "react";
import { ASTNode, Equation } from "@/src/types/ast";

interface DebugPanelProps {
  equation: Equation;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ equation }) => {
  const printTree = (
    node: ASTNode,
    prefix: string = "",
    isLeft: boolean = true,
    output: string[] = []
  ) => {
    if (node.type === "binary_op") {
      printTree(node.right, prefix + (isLeft ? "│   " : "    "), false, output);
    }
    output.push(
      prefix +
        (isLeft ? "└── " : "┌── ") +
        (node.type === "binary_op" ? node.operator : node.coefficient) +
        (node.type === "variable" ? "x" : "")
    );

    if (node.type === "binary_op") {
      printTree(node.left, prefix + (isLeft ? "    " : "│   "), true, output);
    }

    return output.join("\n");
  };

  return (
    <div className="mt-4 bg-gray-100 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">Debug AST:</h4>
      <pre className="text-xs text-gray-500 overflow-auto">
        {printTree(equation.left)}
        {"\n"}
        {printTree(equation.right)}
      </pre>
    </div>
  );
};
