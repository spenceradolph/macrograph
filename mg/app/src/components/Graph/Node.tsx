import React, { useCallback, useRef } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { NodeType } from "@macrograph/core";

import FunctionSocket from "./FunctionSocket";
import Socket from "./Socket";
import SocketInput from "./SocketInput";
import { Node as NodeModel } from "../../store/Nodes";
import { invokeIpc } from "../../utils";
import { Store } from "../../store";

interface Props {
  node: NodeModel;
  selected: boolean;
  onMouseDown(): void;
}

const HEADER_COLOR: Record<NodeType, string> = {
  Base: "bg-gray-500",
  Exec: "bg-blue-600",
  Pure: "bg-green-600",
  Event: "bg-red-700",
};

const Node = observer(({ node, selected, onMouseDown }: Props) => {
  const mouseDownPos = useRef<number[] | null>(null);

  const mouseCallback = useCallback(
    (e: MouseEvent) => {
      if (mouseDownPos.current !== null) {
        const offset = mouseDownPos.current;
        node.setPosition({
          x: e.clientX - offset[0],
          y: e.clientY - offset[1],
        });
      }
    },
    [node]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "Backspace":
        case "Delete": {
          Store.graph.deleteNode({ node: node.id });
          break;
        }
      }
    },
    [node]
  );

  return (
    <div
      className="absolute flex flex-col border-2 border-opacity-75 border-black rounded-md text-white overflow-hidden shadow group focus:outline-none whitespace-nowrap"
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        minWidth: 100,
        boxShadow: clsx(
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          selected && ", 0 0 1px 2px #e3a008"
        ),
        backgroundColor: "rgba(0, 0, 0, 75%)",
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={clsx(
          "px-2 h-6 cursor-pointer text-left bg-red-700",
          HEADER_COLOR[node.variant]
        )}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown();
          window.addEventListener("mousemove", mouseCallback);
          mouseDownPos.current = [
            e.clientX - node.position.x,
            e.clientY - node.position.y,
          ];

          const upListener = () => {
            window.removeEventListener("mousemove", mouseCallback);
            mouseDownPos.current = null;
            invokeIpc({
              type: "SetNodePosition",
              id: node.id,
              position: toJS(node.position),
            });
            window.removeEventListener("mouseup", upListener);
          };

          window.addEventListener("mouseup", upListener);
        }}
      >
        {node.displayName}
      </div>
      <div className="flex flex-1 space-x-4 p-2">
        <div className="flex flex-1 flex-col items-start space-y-2">
          {node.inputExecPins.map((pin) => (
            <FunctionSocket key={pin.id} {...{ node, pin }} />
          ))}
          {node.inputDataPins.map((pin) => (
            <div
              key={pin.id}
              className="flex flex-row justify-start items-center space-x-2"
            >
              <Socket {...{ node, pin }} />
              <SocketInput pin={pin} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col items-end space-y-2">
          {node.outputExecPins.map((pin) => (
            <FunctionSocket key={pin.id} {...{ node, pin }} />
          ))}
          {node.outputDataPins.map((pin) => (
            <Socket key={pin.id} {...{ node, pin }} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Node;
