import { BrowserWindow, ipcMain } from "electron";

import { core, NodePin, RendererRequestsMap } from "@macrograph/core";

export const handleIpc = <T extends keyof RendererRequestsMap>(
  type: T,
  callback: (
    args: RendererRequestsMap[T]["args"]
  ) => RendererRequestsMap[T]["returns"]
) => {
  ipcMain.handle(type, (_, args) => callback(args));
};

const handleAllIpc = (
  callbacks: {
    [P in keyof RendererRequestsMap]: (
      args: RendererRequestsMap[P]["args"]
    ) => RendererRequestsMap[P]["returns"];
  }
) => {
  Object.entries(callbacks).forEach(([type, callback]) =>
    handleIpc(type as any, callback)
  );
};

export const startup = (win: BrowserWindow) => {
  const EventService = core.EventService;
  const NodesManager = core.NodesManager;

  EventService.onAny((type: string | string[], args: any) => {
    if (typeof type === "string")
      win.webContents.send(`${type}`, { ...args });
  });

  handleAllIpc({
    CreateNode: (args) => core.Project.CreateNode(args),
    SetNodePosition: (args) =>
      (core.Project.Nodes[args.id].Position = args.position),
    ConnectExecPins: ({ from, to }) => {
      const fromNode = core.Project.Nodes[from.node];
      const toNode = core.Project.Nodes[to.node];

      const fromPin = fromNode.OutputExecPins.find((p) => p.ID === from.pin);
      const toPin = toNode.InputExecPins.find((p) => p.ID === to.pin);

      if (fromPin === undefined || toPin === undefined) throw new Error();

      core.Project.ConnectExecPins(fromPin, toPin);
    },
    ConnectDataPins: ({ from, to }) => {
      const fromNode = core.Project.Nodes[from.node];
      const toNode = core.Project.Nodes[to.node];

      const fromPin = fromNode.OutputDataPins.find((p) => p.ID === from.pin);
      const toPin = toNode.InputDataPins.find((p) => p.ID === to.pin);

      if (fromPin === undefined || toPin === undefined) throw new Error();

      core.Project.ConnectDataPins(fromPin, toPin);
    },
    DisconnectPin: (args) => {
      const node = core.Project.Nodes[args.node];
      let pinsArr: NodePin[];

      if (args.exec) {
        if (args.input) pinsArr = node.InputExecPins;
        else pinsArr = node.OutputExecPins;
      } else {
        if (args.input) pinsArr = node.InputDataPins;
        else pinsArr = node.OutputDataPins;
      }

      const pin = pinsArr.find((p) => p.ID === args.pin);
      if (pin === undefined) throw new Error();

      pin.Disconnect();
    },
    SetUnconnectedData: (args) => {
      const pin = core.Project.Nodes[args.node].InputDataPins.find(
        (p) => p.ID === args.pin
      );
      if (pin) pin.UnconnectedData = args.data;
      else throw new Error();
    },
    UIReady: () => {
      require("/Users/brendanallan/Documents/Programming/macrograph-new/mg/packages/obs");
      require("/Users/brendanallan/Documents/Programming/macrograph-new/mg/packages/math");
      require("/Users/brendanallan/Documents/Programming/macrograph-new/mg/packages/test");
      require("/Users/brendanallan/Documents/Programming/macrograph-new/mg/packages/util");
      require("/Users/brendanallan/Documents/Programming/macrograph-new/mg/packages/midi");
      win!.show();
    },
    DeleteNode: ({ node }) => {
      const nodeInstance = core.Project.Nodes[node];
      if (nodeInstance === undefined)
        throw new Error(`Cannot find node with id ${node} to delete`);

      nodeInstance.InputDataPins.forEach((p) => p.Disconnect());
      nodeInstance.OutputDataPins.forEach((p) => p.Disconnect());
      nodeInstance.InputExecPins.forEach((p) => p.Disconnect());
      nodeInstance.OutputExecPins.forEach((p) => p.Disconnect());

      delete core.Project.Nodes[node];
    },
    RegisteredNodes: () => {
      return NodesManager.AllNodes();
    },
  });
};
