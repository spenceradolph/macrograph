import { useState } from "react";
import { observer } from "mobx-react-lite";

import CreateNodeMenu from "./components/Graph/UI/CreateNodeMenu";
import NodesRenderer from "./components/Graph/NodesRenderer";
import Select from "./components/Graph/UI/Select";
import ConnectionRenderer from "./components/Graph/Connection/ConnectionRenderer";
import { Store } from "./store";
import { ipcBus } from "./utils";
import { toJS } from "mobx";
import { SelectProperty, TextProperty } from "./store/EngineStore";

async function init() {
  await ipcBus.invoke("app:uiReady");

  const pkgs: any[] = await ipcBus.invoke("packages:registered");

  pkgs.forEach((pkg: any) => Store.packages.registerPackage(pkg));

  const res = await ipcBus.invoke("engines");
  res.forEach((engine: any) => Store.engines.registerEngine(engine));
}

init();

const App = observer(() => {
  const [selectedNode, setSelectedNode] = useState<number | undefined>(
    undefined
  );

  const createNodeMenuPosition = toJS(Store.ui.createNodeMenu.position);

  return (
    <div className="w-screen h-screen flex flex-row">
      <div
        className="flex-1 relative bg-gray-600 overflow-hidden select-none"
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
      <div className="w-96 bg-gray-800 border-l border-black flex flex-col items-stretch p-2">
        {[...Store.engines.engines.values()].map((e) => (
          <div key={e.name} className="text-left text-white text-lg">
            <h1>{e.name}</h1>
            <div className="mx-2 text-md flex flex-col space-y-2">
              {[...e.properties.values()].map((p) => {
                let control;

                if (p instanceof SelectProperty) {
                  control = (
                    <Select value={p.value} options={p.options} />
                    // <select
                    //   className="rounded-md bg-gray-600 text-white p-1 flex-1"
                    //   value={p.value}
                    //   onChange={(ev) => {
                    //     p.value = ev.target.value;
                    //   }}
                    // >
                    //   {p.options.map((o) => (
                    //     <option value={o} key={o}>
                    //       {o.toString()}
                    //     </option>
                    //   ))}
                    // </select>
                  );
                } else if (p instanceof TextProperty) {
                  control = (
                    <input className="h-6 rounded-md" value={p.value} />
                  );
                }

                return (
                  <div
                    key={p.name}
                    className="flex flex-row space-x-4 max-w-max"
                  >
                    <div className="w-24">
                      <p>{p.name}</p>
                    </div>
                    {control}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default App;
