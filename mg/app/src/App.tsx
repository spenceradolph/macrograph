import { useState } from "react";
import { observer } from "mobx-react-lite";

import CreateNodeMenu from "./components/Graph/UI/CreateNodeMenu";
import NodesRenderer from "./components/Graph/NodesRenderer";
import ConnectionRenderer from "./components/Graph/Connection/ConnectionRenderer";
import { Store } from "./store";
import { handleCoreIpc, invokeIpc } from "./utils";
import { toJS } from "mobx";

handleCoreIpc("NodeRegistered", (args) => Store.packages.registerNode(args));
invokeIpc({ type: "UIReady" });
invokeIpc({ type: "RegisteredNodes" }).then((pkgs) =>
  pkgs.forEach((pkg) => Store.packages.registerPackage(pkg))
);

const App = observer(() => {
  const [selectedNode, setSelectedNode] = useState<number | undefined>(
    undefined
  );

  const createNodeMenuPosition = toJS(Store.ui.createNodeMenu.position);

  return (
    <div
      className="w-screen h-screen relative bg-gray-600 overflow-hidden select-none"
      onClick={() => {
        Store.ui.toggleCreateNodeMenu();
      }}
      onMouseDown={() => {
        setSelectedNode(undefined);
      }}
      onMouseUp={() => {
        Store.ui.setMouseDragLocation();
        Store.ui.setDraggingPin();
      }}
      onContextMenu={(e) => {
        e.preventDefault();

        Store.ui.toggleCreateNodeMenu(
          createNodeMenuPosition
            ? undefined
            : { x: e.clientX - 20, y: e.clientY - 20 }
        );
      }}
    >
      <ConnectionRenderer onClick={() => setSelectedNode(undefined)} />
      <NodesRenderer
        selected={selectedNode}
        setSelectedNode={setSelectedNode}
      />
      {createNodeMenuPosition && (
        <div
          className="absolute"
          style={{
            top: createNodeMenuPosition.y,
            left: createNodeMenuPosition.x,
          }}
        >
          <CreateNodeMenu
            onNodeClicked={(pkg, name) => {
              Store.graph
                .createNode({
                  position: createNodeMenuPosition,
                  pkg,
                  name,
                })
                .then(() => Store.ui.toggleCreateNodeMenu());
            }}
            items={[...Store.packages.packages.entries()].reduce(
              (acc, [name, nodesMap]) => ({ ...acc, [name]: nodesMap.nodes }),
              {}
            )}
          />
        </div>
      )}
    </div>
  );
});

export default App;
