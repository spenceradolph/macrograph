import {
  EventNode,
  ExecNode,
  Node,
  types,
  Property,
  BaseEngine,
  Select,
  Engine as DeclareEngine,
} from "macrograph";
import { ipcMain, BrowserWindow } from "electron";

const win = new BrowserWindow({
  show: false,
  webPreferences: {
    contextIsolation: true,
    preload: `${__dirname}/electron/preload.js`,
  },
});

win.webContents.openDevTools();

win.loadURL(`file://${__dirname}/electron/index.html`);

ipcMain.handle(`midi`, (_, { type, data }) => {
  Engine.emit(type, data);
});

@DeclareEngine("midi")
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

    this.on("send-basic", ({ note, velocity, channel }) => {
      win.webContents.send("send-basic", {
        note,
        velocity,
        channel,
        device: this.inputs.value,
      });
    });
  }
}

export const Engine = new _Engine();

@Node({ displayName: "MIDI Device Connected" })
class MIDIDeviceConnected extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Name", types.string);
    this.AddOutputDataPin("Is Input", types.boolean);

    Engine.on("connected", (data) => this.Start(data));
  }

  Fire({ name, type }: any) {
    this.OutputDataPins[0].Data = name;
    this.OutputDataPins[1].Data = type === "input";
  }
}

@Node({ displayName: "Send Basic MIDI" })
class MIDISendBasic extends ExecNode {
  build() {
    super.build();

    this.AddInputDataPin("Note", types.int);
    this.AddInputDataPin("Velocity", types.int);
    this.AddInputDataPin("Channel", types.int);
  }

  Work() {
    const [note, velocity, channel] = this.InputDataPins.map((p) => p.Data);
    Engine.emit("send-basic", { note, velocity, channel });
  }
}
