import { SelectedNode } from "@/src/types/ast";

//render selected node for proper display
export const RenderSelectedNode = (
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
