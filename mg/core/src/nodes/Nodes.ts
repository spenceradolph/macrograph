import { XYCoords } from "..";
import {
  NodeInputDataPin,
  NodeOutputDataPin,
  NodeInputExecPin,
  NodeOutputExecPin,
} from "./Pins";
import { PinType } from "./PinTypes";

export abstract class BaseNode {
  readonly InputDataPins: NodeInputDataPin[] = [];
  readonly OutputDataPins: NodeOutputDataPin[] = [];
  readonly InputExecPins: NodeInputExecPin[] = [];
  readonly OutputExecPins: NodeOutputExecPin[] = [];

  AddInputDataPin(Name = "", Type: PinType): NodeInputDataPin | void {
    const pin = new NodeInputDataPin(this, Name, Type);
    this.InputDataPins.push(pin);
    return pin;
  }

  AddInputExecPin(Name = "") {
    this.InputExecPins.push(new NodeInputExecPin(this, Name));
  }

  AddOutputDataPin(Name = "", Type: PinType) {
    const pin = new NodeOutputDataPin(this, Name, Type);
    this.OutputDataPins.push(pin);
    return pin;
  }

  AddOutputExecPin(Name = "") {
    this.OutputExecPins.push(new NodeOutputExecPin(this, Name));
  }

  displayName: string;

  constructor(
    public ID: number,
    public Position: XYCoords,
    public Type: string
  ) {
    this.build();
    this.displayName = Type;
  }

  abstract Work(): Promise<void>;
  async Process() {
    await Promise.all(
      this.InputDataPins.map(async (p) => {
        if (p.IncomingPin) {
          if (p.IncomingPin.Node instanceof ValueNode)
            await p.IncomingPin.Node.Process();

          p.Data = p.IncomingPin.Data;
        } else p.Data = p.UnconnectedData;
      })
    );
    try {
      await this.Work();
    } catch {}
  }

  abstract build(): void;
}

export abstract class ExecNode extends BaseNode {
  build() {
    this.AddInputExecPin("");
    this.AddOutputExecPin("");
  }

  async Process() {
    await super.Process();
    await this.OutputExecPins[0].OutgoingPin?.Node.Process();
  }
}

export abstract class EventNode extends BaseNode {
  build() {
    this.AddOutputExecPin("");
  }

  /**
   * @description Calculate output data from event data
   */
  abstract Fire(EventData: any): void;

  async Work() {}

  /**
   * @description Begin processing node chain
   */
  Start(EventData?: any) {
    this.Fire(EventData);
    return this.Process();
  }

  async Process() {
    await this.ExecOutput1.OutgoingPin?.Node.Process();
  }

  AddInputDataPin() {
    throw new Error("Event nodes cannot have data inputs!");
  }

  AddInputExecPin() {
    throw new Error("Event nodes cannot have exec inputs!");
  }

  get ExecOutput1() {
    return this.OutputExecPins[0];
  }
}

export abstract class ValueNode extends BaseNode {
  AddInputExecPin() {
    throw new Error("Value node cannot be executed!");
  }

  AddOutputExecPin() {
    throw new Error("Value node cannot be executed!");
  }
}
