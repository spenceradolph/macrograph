import { SerializedNode, XYCoords } from "@macrograph/core";
import { observable, flow } from "mobx";
import { ipcBus } from "../utils";

import {
  DataConnection,
  ExecConnection,
  InputDataPin,
  InputExecPin,
  Node,
  NodePin,
  OutputDataPin,
  OutputExecPin,
  pinIsData,
  pinIsInput,
  pinsAreIOPair,
} from "./Nodes";

export class GraphStore {
  nodes = observable(new Map<number, Node>());
  connections = observable<DataConnection | ExecConnection>([]);

  createNode = flow(function* (
    this: GraphStore,
    args: {
      position: XYCoords;
      pkg: string;
      name: string;
    }
  ) {
    const node: SerializedNode = yield ipcBus.invoke(
      "project:createNode",
      args
    );

    const instance = new Node(node, this);

    this.nodes.set(instance.id, instance);
  });

  deleteNode = flow(function* (this: GraphStore, args: { node: number }) {
    try {
      yield ipcBus.invoke("project:deleteNode", args.node);

      const nodeInstance = this.nodes.get(args.node);

      if (nodeInstance === undefined) return;

      nodeInstance.disconnect();

      this.nodes.delete(nodeInstance.id);
    } catch {}
  });

  connectPins = flow(function* (
    this: GraphStore,
    args: { from: NodePin; to: NodePin }
  ) {
    const pairInfo = pinsAreIOPair(args.from, args.to);
    if (!pairInfo) return;

    const outputPin = pairInfo.reverse ? args.to : args.from;
    const inputPin = pairInfo.reverse ? args.from : args.to;

    try {
      yield ipcBus.invoke("project:connectPins", {
        from: { pin: outputPin.id, node: outputPin.node.id },
        to: { pin: inputPin.id, node: inputPin.node.id },
      });

      if (pairInfo.data) {
        const connection = new DataConnection({
          id: `${outputPin.id}->${inputPin.id}`,
          output: outputPin as OutputDataPin,
          outputNode: inputPin.node,
          input: inputPin as InputDataPin,
          inputNode: inputPin.node,
          type: (outputPin as OutputDataPin).type,
        });

        this.connections.push(connection);

        (outputPin as OutputDataPin).connections.push(connection);

        const pastConnection = (inputPin as InputDataPin).connection;
        if (pastConnection) {
          pastConnection.output.connections.remove(pastConnection);
          this.connections.remove(pastConnection);
        }

        (inputPin as InputDataPin).connection = connection;
      } else {
        const connection = new ExecConnection({
          id: `${outputPin.id}->${inputPin.id}`,
          output: outputPin as OutputExecPin,
          outputNode: outputPin.node,
          input: inputPin as InputExecPin,
          inputNode: inputPin.node,
        });

        this.connections.push(connection);

        const pastInputConnection = (inputPin as InputExecPin).connection;
        if (pastInputConnection) {
          pastInputConnection.output.connection = undefined;
          this.connections.remove(pastInputConnection);
        }
        (inputPin as InputExecPin).connection = connection;

        const pastOutputConnection = (outputPin as OutputExecPin).connection;
        if (pastOutputConnection) {
          pastOutputConnection.input.connection = undefined;
          this.connections.remove(pastOutputConnection);
        }
        (outputPin as InputExecPin).connection = connection;
      }
    } catch {}
  });

  disconnectPin = flow(function* (this: GraphStore, pin: NodePin) {
    try {
      yield ipcBus.invoke("project:disconnectPin", {
        node: pin.node.id,
        pin: pin.id,
      });

      if (pinIsData(pin)) {
        let connections: DataConnection[];

        if (pinIsInput(pin))
          connections = pin.connection ? [pin.connection] : [];
        else connections = [...pin.connections];

        connections.forEach((c) => {
          c.input.connection = undefined;
          c.output.connections.remove(c);
          this.connections.remove(c);
        });
      } else {
        const connection = pin.connection;
        if (connection === undefined) return;

        connection.input.connection = undefined;
        connection.output.connection = undefined;

        this.connections.remove(connection);
      }
    } catch {}
  });
}
