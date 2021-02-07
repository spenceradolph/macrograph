import type { PinType, XYCoords } from "@macrograph/core";
import { DataConnection, ExecConnection, Node } from ".";
import { action, computed, flow, observable } from "mobx";
import { ipcBus } from "../../utils";

export class BasePin {
  id: string;

  @observable name: string;
  @observable selected = false;
  @observable position: XYCoords = { x: 0, y: 0 };

  node: Node;

  constructor(args: { name: string; id: string; node: Node }) {
    this.name = args.name;
    this.id = args.id;
    this.node = args.node;
  }

  @action
  setSelected(selected: boolean) {
    this.selected = selected;
  }

  @action
  setPosition(position: XYCoords) {
    this.position = position;
  }
}

export class InputDataPin extends BasePin {
  type: PinType;
  @observable unconnectedData?: string | number | boolean;
  @observable connection?: DataConnection;

  constructor(
    args: ConstructorParameters<typeof BasePin>[0] & { type: PinType }
  ) {
    super(args);
    this.type = args.type;
  }

  @computed
  get connected() {
    return this.connection !== undefined;
  }
  setUnconnectedData = flow(function* (
    this: InputDataPin,
    data: string | number | boolean
  ) {
    yield ipcBus.invoke("project:setUnconnectedData", {
      pin: this.id,
      node: this.node.id,
      data,
    });

    this.unconnectedData = data;
  });
}

export class OutputDataPin extends BasePin {
  type: PinType;
  connections = observable<DataConnection>([]);

  constructor(
    args: ConstructorParameters<typeof BasePin>[0] & { type: PinType }
  ) {
    super(args);
    this.type = args.type;
  }

  @computed
  get connected() {
    return this.connections.length > 0;
  }
}

export class InputExecPin extends BasePin {
  @observable connection?: ExecConnection;

  @computed
  get connected() {
    return this.connection !== undefined;
  }
}

export class OutputExecPin extends BasePin {
  @observable connection?: ExecConnection;

  @computed
  get connected() {
    return this.connection !== undefined;
  }
}

export const pinIsData = (pin: NodePin): pin is InputDataPin | OutputDataPin =>
  pin instanceof InputDataPin || pin instanceof OutputDataPin;
export const pinIsExec = (pin: NodePin): pin is InputExecPin | OutputExecPin =>
  pin instanceof InputExecPin || pin instanceof OutputExecPin;
export const pinIsInput = (pin: NodePin): pin is InputDataPin | InputExecPin =>
  pin instanceof InputDataPin || pin instanceof InputExecPin;
export const pinIsOutput = (
  pin: NodePin
): pin is OutputExecPin | OutputDataPin =>
  pin instanceof OutputExecPin || pin instanceof OutputDataPin;
export const pinsAreIOPair = (pin1: NodePin, pin2: NodePin) => {
  const firstIsInput = pinIsInput(pin1);
  const firstIsData = pinIsData(pin1);

  const ioPair = firstIsInput !== pinIsInput(pin2);
  const typeMatch = firstIsData === pinIsData(pin2);

  if (ioPair && typeMatch) {
    return {
      data: firstIsData,
      reverse: firstIsInput,
    };
  } else return false;
};

export type NodePin =
  | InputDataPin
  | OutputDataPin
  | InputExecPin
  | OutputExecPin;
