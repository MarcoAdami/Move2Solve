// contexts/SelectionContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ASTNode, Side } from "@/app/types/ast";
import { SelectedNode } from "@/app/types/ast";

interface SelectionContextType {
  selectedNodes: SelectedNode[];
  selectNode: (node: ASTNode, side: Side) => void;
  clearSelection: () => void;
  getSelectedNodeIds: () => string[];
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);

  const selectNode = (node: ASTNode, side: Side) => {
    setSelectedNodes((prevSelected) => {
      // Clear if we already have 2 selections
      if (prevSelected.length === 2) {
        return [{ node, side }];
      }

      // Filter selection based on rules
      let newSelected = prevSelected.filter((selected) => {
        // Types rule: if a different type is selected then remove the previous one
        if (selected.node.type !== node.type) {
          return false;
        }
        // Side rule: keep only those on the same side
        return selected.side === side;
      });

      // Check if the node is already selected
      const alreadySelected = newSelected.find(
        (selected) => selected.node.id === node.id
      );

      if (alreadySelected) {
        // If already selected, remove it (toggle off)
        newSelected = newSelected.filter(
          (selected) => selected.node.id !== node.id
        );
      } else {
        // If not selected, add it
        newSelected.push({ node, side });
      }

      return newSelected;
    });
  };

  const clearSelection = () => {
    setSelectedNodes([]);
  };

  const getSelectedNodeIds = (): string[] => {
    return selectedNodes.map((selected) => selected.node.id);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedNodes,
        selectNode,
        clearSelection,
        getSelectedNodeIds,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
