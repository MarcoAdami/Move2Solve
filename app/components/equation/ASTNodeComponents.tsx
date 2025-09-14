// ASTNodeComponent.tsx - Component for rendering AST nodes (Updated)

import React from "react";
import { ASTNode, Side } from "@/app/types/ast";

interface ASTNodeProps {
  node: ASTNode;
  side: Side;
  isFirst?: boolean;
  isSelected?: boolean;
  onDragStart: (
    e: React.DragEvent,
    node: ASTNode,
    path: string[],
    side: Side
  ) => void;
  onNodeSelect?: (node: ASTNode, side: Side) => void;
}

export const ASTNodeComponent: React.FC<ASTNodeProps> = ({
  node,
  side,
  isFirst = true,
  isSelected = false,
  onDragStart,
  onNodeSelect,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, node, [], side);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNodeSelect) {
      onNodeSelect(node, side);
    }
  };

  if (node.type === "variable") {
    const coeff = node.coefficient;
    let display = "";

    if (coeff === 1) {
      display = isFirst ? "x" : "+x";
    } else if (coeff === -1) {
      display = "-x";
    } else if (coeff > 0) {
      display = isFirst ? `${coeff}x` : `+${coeff}x`;
    } else {
      display = `${coeff}x`;
    }

    const selectedClass = isSelected
      ? "ring-2 ring-purple-500 ring-offset-2 bg-purple-300"
      : "bg-purple-200 hover:bg-purple-300";

    return (
      <span
        key={node.id}
        draggable
        onDragStart={handleDragStart}
        onClick={handleClick}
        className={`${selectedClass} px-3 py-1 rounded cursor-pointer border border-purple-400 transition-all duration-200 inline-block mx-1 select-none`}
        title="Click to select, drag to move"
      >
        {display}
      </span>
    );
  } else if (node.type === "constant") {
    const value = node.coefficient;
    const display = isFirst
      ? `${value}`
      : value >= 0
      ? `+${value}`
      : `${value}`;

    const selectedClass = isSelected
      ? "ring-2 ring-yellow-500 ring-offset-2 bg-yellow-300"
      : "bg-yellow-200 hover:bg-yellow-300";

    return (
      <span
        key={node.id}
        draggable
        onDragStart={handleDragStart}
        onClick={handleClick}
        className={`${selectedClass} px-3 py-1 rounded cursor-pointer border border-yellow-400 transition-all duration-200 inline-block mx-1 select-none`}
        title="Click to select, drag to move"
      >
        {display}
      </span>
    );
  } else {
    // binary_op
    const leftRender = (
      <ASTNodeComponent
        node={node.left}
        side={side}
        isFirst={isFirst}
        isSelected={isSelected}
        onDragStart={onDragStart}
        onNodeSelect={onNodeSelect}
      />
    );
    const rightRender = (
      <ASTNodeComponent
        node={node.right}
        side={side}
        isFirst={false}
        isSelected={isSelected}
        onDragStart={onDragStart}
        onNodeSelect={onNodeSelect}
      />
    );

    return (
      <React.Fragment key={node.id}>
        {leftRender}
        {rightRender}
      </React.Fragment>
    );
  }
};
