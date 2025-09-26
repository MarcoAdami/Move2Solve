// components/SelectionPanel.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ASTNode, SelectedNode} from "@/app/types/ast";
import { createResultNode, validateUserInput } from "@/app/utils/selectionUtils";
import { RenderSelectedNode } from "./RenderSelectedNode";

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


  
  // Handles the Enter key press
  //REVIEW:  there is no space to show it, meaningfull for feedback
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateUserInput(userInput, selectedNodes)) {
        const resultNode = createResultNode(selectedNodes);
        //REVIEW: I think onCombineNodes can be removed from if
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

  return (
    <div>
      <div className="flex gap-2">
        <h4 className="text-xl font-semibold text-gray-700">
          Selected Elements:
        </h4>
        {selectedNodes.map((selectedNode, index) =>
          RenderSelectedNode(selectedNode, index)
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
