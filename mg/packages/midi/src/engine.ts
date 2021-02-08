import {
  BaseEngine,
  Property,
  Select,
  Engine as DeclareEngine,
} from "macrograph";
import { win } from "./window";

export enum MIDIEventType {
  Note_On,
  Note_Off,
  Control_Change,
}

@DeclareEngine("midi", {
  enums: {
    MIDIEventType,
  },
})
class _Engine extends BaseEngine {
  @Property()
  inputs!: Select;

  @Property()
  outputs!: Select;

  async start() {
    this.on("connected", ({ name, type }) => {
      const arr = type === "input" ? this.inputs.options : this.outputs.options;

      if (!arr.includes(name)) arr.push(name);
    });

    this.on("disconnected", ({ name, type }) => {
      const arr = type === "input" ? this.inputs.options : this.outputs.options;

      const index = arr.findIndex((o) => o === name);
      if (index !== -1) arr.splice(index);
    });

    this.on("send-basic", ({ index, value, channel, type }) => {
      win.webContents.send("send-basic", {
        index,
        value,
        channel,
        type,
        device: this.inputs.value,
      });
    });

    this.inputs.onChange((i: string) => {
      win.webContents.send("set-input", i);
    });

    this.outputs.onChange((o: string) => {
      win.webContents.send("set-output", o);
    });

    this.on("standard-received", ({ type, ...data }) => {
      let action: string;

      switch (type) {
        case 0:
          action = "noteon";
          break;
        case 1:
          action = "noteoff";
          break;
        case 2:
          action = "cc";
          break;
        default:
          return;
      }

      this.emit(action, data);
    });
  }
}

export const Engine = new _Engine();
