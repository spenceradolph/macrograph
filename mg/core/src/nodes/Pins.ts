import { BaseNode } from "./Nodes";
import { v4 as uuid } from "uuid";

import { PinType, PinTypes, typeDefault } from "./PinTypes";

export abstract class NodePin {
  ID = uuid();

  constructor(public Node: BaseNode, public Name: string) {}

  toString() {
    return this.Name;
  }

  abstract Disconnect(): void;

  abstract get HasConnection(): boolean;
}

export abstract class NodeDataPin extends NodePin {
  PinType: PinType;
  _data: any;

  get Data() {
    return this._data;
  }

  set Data(val: any) {
    switch (this.PinType.type) {
      case "Boolean":
        if (typeof val === "boolean") {
          this._data = val;
          return;
        }
      case "Float":
        if (typeof val === "number") {
          this._data = val;
          return;
        }
      case "Int":
        if (typeof val === "number" && val % 1 === 0) {
          this._data = val;
          return;
        }
      case "Enum":
        // need to verify that number is valid enum value
        if (typeof val === "number" && val % 1 === 0) {
          this._data = val;
          return;
        }
      case "String":
        if (typeof val === "string") {
          this._data = val;
          return;
        }
    }
    console.log(`Value ${val} does not conform to type ${this.PinType.type}`);
  }

  constructor(Node: BaseNode, Name: string, PinType: PinType) {
    super(Node, Name);
    this.PinType = PinType;
  }

  toString() {
    return `${this.Name}: ${this.PinType}`;
  }
}

export class NodeOutputDataPin extends NodeDataPin {
  OutgoingPins: NodeInputDataPin[] = [];

  Disconnect() {
    this.OutgoingPins.forEach((p) => p.Disconnect());
    this.OutgoingPins = [];
  }

  get HasConnection() {
    return this.OutgoingPins.length > 0;
  }
}

export class NodeInputDataPin extends NodeDataPin {
  IncomingPin: NodeOutputDataPin | null = null;

  UnconnectedData = typeDefault(this.PinType);

  SetUnconnectedValue(NewValue: any) {
    this.UnconnectedData = NewValue;
  }

  Disconnect() {
    if (this.IncomingPin) {
      const OutgoingPins = this.IncomingPin.OutgoingPins;
      OutgoingPins.splice(OutgoingPins.indexOf(this));
    }
    this.IncomingPin = null;
    this._data = undefined;
  }

  get HasConnection() {
    return this.IncomingPin !== null;
  }
}

export abstract class NodeExecPin extends NodePin {}

export class NodeOutputExecPin extends NodeExecPin {
  OutgoingPin: NodeInputExecPin | null = null;

  Disconnect() {
    if (this.OutgoingPin) this.OutgoingPin.IncomingPin = null;
    this.OutgoingPin = null;
  }

  get HasConnection() {
    return this.OutgoingPin !== null;
  }
}

export class NodeInputExecPin extends NodeExecPin {
  IncomingPin: NodeOutputExecPin | null = null;

  Disconnect() {
    if (this.IncomingPin) this.IncomingPin.OutgoingPin = null;
    this.IncomingPin = null;
  }

  get HasConnection() {
    return this.IncomingPin !== null;
  }
}

export const pinIsOutput = (
  pin: NodeInputDataPin | NodeOutputDataPin
): pin is NodeOutputDataPin => pin instanceof NodeOutputDataPin;

export const pinIsDataIO = (
  pin: NodePin
): pin is NodeOutputDataPin | NodeInputDataPin => pin instanceof NodeDataPin;

export const pinIsExecIO = (
  pin: NodePin
): pin is NodeOutputExecPin | NodeInputExecPin => pin instanceof NodeExecPin;
