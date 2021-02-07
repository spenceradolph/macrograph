import { NodeType, SerializedNode } from "./ipc";
import { typesCompatible } from "./nodes";
import { BaseNode, EventNode, ExecNode, ValueNode } from "./nodes/Nodes";
import {
  NodeInputDataPin,
  NodeInputExecPin,
  NodeOutputDataPin,
  NodeOutputExecPin,
} from "./nodes/Pins";
import NodesManager from "./managers/NodesManager";
import IpcBus from "./services/EventService";
import { CheckDataRecursion, CheckExecRecursion } from "./utils";

export class Project {
  Nodes: Record<number, BaseNode> = {};

  constructor(
    public NodesManager: NodesManager,
    public EventService: IpcBus
  ) {}

  private _NewID = 0;
  get NewID() {
    return this._NewID++;
  }

  CreateNode(args: {
    pkg: string;
    name: string;
    position: { x: number; y: number };
  }): SerializedNode {
    const ctor = this.NodesManager.GetNode(args);

    // @ts-expect-error ctor will extend BaseNode
    const node: BaseNode = new ctor(this.NewID, args.position, args.name);

    this.Nodes[node.ID] = node;

    const serialized = {
      position: args.position,
      type: {
        pkg: args.pkg,
        name: args.name,
      },
      displayName: node.displayName,
      id: node.ID,
      pins: {
        exec: {
          in: node.InputExecPins.map((ip) => ({
            name: ip.Name,
            id: ip.ID,
            node: node.ID,
            ...(ip.HasConnection
              ? {
                  connection: {
                    nodeId: ip.IncomingPin!.Node.ID,
                    pin: ip.IncomingPin!.ID,
                  },
                }
              : {}),
          })),
          out: node.OutputExecPins.map((op) => ({
            name: op.Name,
            id: op.ID,
            node: node.ID,
            ...(op.HasConnection
              ? {
                  connection: {
                    nodeId: op.OutgoingPin!.Node.ID,
                    pin: op.OutgoingPin!.ID,
                  },
                }
              : {}),
          })),
        },
        data: {
          in: node.InputDataPins.map((ip) => ({
            name: ip.Name,
            id: ip.ID,
            node: node.ID,
            ...(ip.HasConnection
              ? {
                  connection: {
                    nodeId: ip.IncomingPin!.Node.ID,
                    pin: ip.IncomingPin!.ID,
                  },
                }
              : {}),
            type: ip.PinType,
          })),
          out: node.OutputDataPins.map((op) => ({
            name: op.Name,
            id: op.ID,
            node: node.ID,
            connections: op.OutgoingPins.map((ip) => ({
              nodeId: ip.Node.ID,
              pin: ip.ID,
            })),
            type: op.PinType,
          })),
        },
      },
      variant: (node instanceof ValueNode
        ? "Pure"
        : node instanceof ExecNode
        ? "Exec"
        : node instanceof EventNode
        ? "Event"
        : "Base") as NodeType,
    };

    return serialized;
  }

  ConnectDataPins(from: NodeOutputDataPin, to: NodeInputDataPin) {
    if (
      CheckDataRecursion(from, to) ||
      !typesCompatible(from.PinType, to.PinType)
    )
      throw new Error();

    to.Disconnect();

    from.OutgoingPins.push(to);
    to.IncomingPin = from;
  }

  ConnectExecPins(from: NodeOutputExecPin, to: NodeInputExecPin) {
    if (CheckExecRecursion(from, to)) throw new Error();

    from.Disconnect();

    from.OutgoingPin = to;
    to.IncomingPin = from;
  }
  
  

  // AddNode(node: BaseNode) {
  //   this.ConnectPins();
  // }
}
