import { observer } from "mobx-react-lite";
import React, { useState } from "react";

interface NodeCategoryProps {
  namespace: string;
  nodes: Set<string>;
  onNodeClicked(node: string): void;
}

const ItemStyle =
  "hover:bg-gray-300 cursor-pointer hover:text-black rounded-sm px-2";

const NodeCategory = observer((props: NodeCategoryProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-white text-left w-full space-y-1">
      <p
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={ItemStyle}
      >
        {props.namespace}
      </p>
      {open &&
        [...props.nodes.values()].map((type) => (
          <p
            className={`ml-4 ${ItemStyle}`}
            key={type}
            onClick={(e) => {
              e.stopPropagation();
              props.onNodeClicked(type);
            }}
          >
            {type}
          </p>
        ))}
    </div>
  );
});

export interface Props {
  onNodeClicked(namespace: string, type: string): void;
  items: Record<string, Set<string>>;
}
const CreateNodeMenu = observer((props: Props) => (
  <div
    className="w-80 h-64 overflow-y-auto bg-gray-800 p-2 space-y-1 border-2 border-black rounded-md"
    onContextMenu={(e) => e.stopPropagation()}
  >
    {Object.entries(props.items).map(([ns, nodes]) => (
      <NodeCategory
        key={ns}
        namespace={ns}
        nodes={nodes}
        onNodeClicked={(node) => props.onNodeClicked(ns, node)}
      />
    ))}
  </div>
));

export default CreateNodeMenu;
