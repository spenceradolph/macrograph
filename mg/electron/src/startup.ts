import { BrowserWindow, ipcMain } from "electron";
import * as path from "path";

import {
  core,
  NodeInputDataPin,
  NodeInputExecPin,
  NodeOutputDataPin,
  NodeOutputExecPin,
  pinIsExecIO,
} from "@macrograph/core";

export const startup = (win: BrowserWindow) => {
  const ipcBus = core.ipcBus;
  const NodesManager = core.NodesManager;

  ipcMain.handle("IPC_RENDERER", async (_, { type, data }: any) => {
    const res = await ipcBus.emitAsync(type, data);

    console.log(`IPC_RENDERER ${type}`);

    return res[0];
  });

  ipcBus.onMany({
    IPC_MAIN: ({ type, data }: any) => {
      console.log(`IPC_MAIN ${type}`);
      win.webContents.send("IPC_MAIN", { type, data });
    },
    "app:uiReady": async () => {
      require(path.join(__dirname, "../../packages/obs"));
      require(path.join(__dirname, "../../packages/test"));
      require(path.join(__dirname, "../../packages/util"));
      require(path.join(__dirname, "../../packages/midi"));
      require(path.join(__dirname, "../../packages/logic"))

      await core.EngineManager.startAll();

      win!.show();
    },
    engines: () => {
      return core.EngineManager.serializeAll();
    },
    "engines:*": function () {
      const [_, engineName] = (this.event as any).split(":") as string;

      return core.EngineManager.serializeEngine(engineName);
    },
    enums: function () {
      return core.EnumManager.serializeEnums();
    },
    "packages:registered": () => {
      return NodesManager.AllNodes();
    },
    "project:connectPins": ({ from, to }: any) => {
      const fromNode = core.Project.Nodes[from.node];
      const toNode = core.Project.Nodes[to.node];

      const fromPin = [
        ...fromNode.OutputExecPins,
        ...fromNode.OutputDataPins,
      ].find((p) => p.ID === from.pin);
      const toPin = [...toNode.InputExecPins, ...toNode.InputDataPins].find(
        (p) => p.ID === to.pin
      );

      if (!fromPin || !toPin) return;

      const exec = pinIsExecIO(fromPin);
      if (exec !== pinIsExecIO(toPin)) return;

      if (exec)
        core.Project.ConnectExecPins(
          fromPin as NodeOutputExecPin,
          toPin as NodeInputExecPin
        );
      else
        core.Project.ConnectDataPins(
          fromPin as NodeOutputDataPin,
          toPin as NodeInputDataPin
        );
    },
    "project:createNode": (args: any) => {
      return core.Project.CreateNode(args);
    },
    "project:deleteNode": (node: number) => {
      const nodeInstance = core.Project.Nodes[node];
      if (nodeInstance === undefined)
        throw new Error(`Cannot find node with id ${node} to delete`);

      nodeInstance.InputDataPins.forEach((p) => p.Disconnect());
      nodeInstance.OutputDataPins.forEach((p) => p.Disconnect());
      nodeInstance.InputExecPins.forEach((p) => p.Disconnect());
      nodeInstance.OutputExecPins.forEach((p) => p.Disconnect());

      delete core.Project.Nodes[node];
    },
    "project:disconnectPin": (args) => {
      const node = core.Project.Nodes[args.node];

      const pin = [
        ...node.InputDataPins,
        ...node.OutputDataPins,
        ...node.InputExecPins,
        ...node.OutputExecPins,
      ].find((n) => n.ID === args.pin);

      if (pin === undefined) throw new Error();

      pin.Disconnect();
    },
    "project:setNodePosition": (args: any) => {
      core.Project.Nodes[args.id].Position = args.position;
    },
    "project:setUnconnectedData": (args: any) => {
      const pin = core.Project.Nodes[args.node].InputDataPins.find(
        (p) => p.ID === args.pin
      );
      if (pin) pin.UnconnectedData = args.data;
      else return;
    },
  });
};
