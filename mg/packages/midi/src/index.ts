import { EventNode, Node, types, Property } from "macrograph";
import { ipcMain, BrowserWindow } from "electron";
import { EventEmitter2 as EventEmitter } from "eventemitter2";

const win = new BrowserWindow({
  show: false,
});

win.loadURL(`file://${__dirname}/electron/index.html`);
console.log(__dirname);

export const handleIpc = (type: string, callback: (args: any) => void) => {
  ipcMain.handle(`midi:${type}`, (_, args) => callback(args));
};

class _Engine extends EventEmitter {
  static ID = "midi";

  topics = {};

  @Property({ targetProperty: "input" })
  inputs: string[] = [];

  @Property({ targetProperty: "output" })
  outputs: string[] = [];

  @Property()
  input?: string = undefined;

  @Property()
  output?: string = undefined;

  constructor() {
    super();

    this.handle("midi:connected", ({ name }) => this.inputs.push(name));

    this.handle("midi:disconnected", ({ name }) => {
      const index = this.inputs.findIndex(name);
      if (index !== -1) this.inputs.splice(index);
    });
  }

  handle(type: string, callback: (...args: any) => void) {
    if (this.topics[type] !== true) {
      this.topics[type] = true;
      handleIpc(type, (args) => this.emit(type, args));
    }

    this.addListener(type, callback);
  }
}

const Engine = new _Engine();

@Node({ displayName: "MIDI Device Connected" })
class Connected extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Name", types.string);

    Engine.handle("connected", ({ name }) => this.Start(name));
  }

  Fire(name: string) {
    this.OutputDataPins[0].Data = name;
  }
}
