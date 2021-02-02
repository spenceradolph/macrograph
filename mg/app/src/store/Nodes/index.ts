import { NodeType, PinType, SerializedNode, XYCoords } from "@macrograph/core";
import {
  InputDataPin,
  OutputDataPin,
  InputExecPin,
  OutputExecPin,
  BasePin,
  pinIsData,
  pinIsInput,
  NodePin,
} from "./Pins";
import { action, computed, IObservableArray, observable } from "mobx";
import { GraphStore } from "../GraphStore";

export * from "./Pins";

export class Node {
  @observable selected = false;
  @observable displayName;

  variant: NodeType;
  type: {
    pkg: string;
    name: string;
  };
  id: number;

  @observable position: XYCoords;

  inputDataPins: IObservableArray<InputDataPin>;
  outputDataPins: IObservableArray<OutputDataPin>;
  inputExecPins: IObservableArray<InputExecPin>;
  outputExecPins: IObservableArray<OutputExecPin>;

  constructor(args: SerializedNode, public graph: GraphStore) {
    this.displayName = args.displayName;
    this.variant = args.variant;
    this.type = args.type;
    this.position = args.position;
    this.id = args.id;
    this.inputDataPins = observable(
      args.pins.data.in.map(
        (p) =>
          new InputDataPin({
            name: p.name,
            id: p.id,
            node: this,
            type: p.type,
          })
      )
    );
    this.outputDataPins = observable(
      args.pins.data.out.map(
        (p) =>
          new OutputDataPin({
            name: p.name,
            id: p.id,
            node: this,
            type: p.type,
          })
      )
    );
    this.inputExecPins = observable(
      args.pins.exec.in.map(
        (p) =>
          new InputExecPin({
            name: p.name,
            id: p.id,
            node: this,
          })
      )
    );
    this.outputExecPins = observable(
      args.pins.exec.out.map(
        (p) =>
          new OutputExecPin({
            name: p.name,
            id: p.id,
            node: this,
          })
      )
    );
  }

  @action
  setPosition(position: XYCoords) {
    this.position = position;
  }

  @action
  disconnect() {
    this.inputDataPins.forEach((p) => this.disconnectPin(p));
    this.outputDataPins.forEach((p) => this.disconnectPin(p));
    this.inputExecPins.forEach((p) => this.disconnectPin(p));
    this.outputExecPins.forEach((p) => this.disconnectPin(p));
  }

  @action
  disconnectPin(pin: NodePin) {
    if (pinIsData(pin)) {
      let connections: DataConnection[];

      if (pinIsInput(pin)) connections = pin.connection ? [pin.connection] : [];
      else connections = [...pin.connections];

      connections.forEach((c) => {
        c.input.connection = undefined;
        c.output.connections.remove(c);
        this.graph.connections.remove(c);
      });
    } else {
      const connection = pin.connection;
      if (connection === undefined) return;

      connection.input.connection = undefined;
      connection.output.connection = undefined;

      this.graph.connections.remove(connection);
    }
  }
}

export class Connection<O extends BasePin, I extends BasePin> {
  id: string;

  output: O;
  outputNode: Node;
  input: I;
  inputNode: Node;

  constructor(args: {
    id: string;
    output: O;
    outputNode: Node;
    input: I;
    inputNode: Node;
  }) {
    this.id = args.id;
    this.output = args.output;
    this.outputNode = args.outputNode;
    this.input = args.input;
    this.inputNode = args.inputNode;
  }

  @computed
  get path() {
    return {
      x1: this.output.position.x,
      y1: this.output.position.y,
      x2: this.input.position.x,
      y2: this.input.position.y,
    };
  }
}

export class DataConnection extends Connection<OutputDataPin, InputDataPin> {
  type: PinType;

  constructor(args: {
    id: string;
    output: OutputDataPin;
    outputNode: Node;
    input: InputDataPin;
    inputNode: Node;
    type: PinType;
  }) {
    super(args);
    this.type = args.type;
  }
}
export class ExecConnection extends Connection<OutputExecPin, InputExecPin> {}
