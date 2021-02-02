// @ts-nocheck
import { Node, EventNode, ExecNode, types } from "macrograph";
// import { BrowserWindow, ipcMain } from "electron";

// const window = new BrowserWindow({
//   width: 200,
//   height: 200,
//   webPreferences: {
//     nodeIntegration: true,
//   },
// });

// ipcMain.handle("midi:test", (event, ...args) => console.log(args));
// console.log("listening");
// window.loadURL("http://localhost:3001/index.html");

@Node({ displayName: "Event Node", pkg: "Test" })
export class Event extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Data", types.string);

    setInterval(() => this.Start({}), 1000);
  }

  get DataOutputPin() {
    return this.OutputDataPins[0];
  }

  Fire() {
    this.DataOutputPin.Data = Math.round(Math.random() * 10000).toString();
  }
}

@Node({ displayName: "Exec Node", pkg: "Test" })
export class Exec extends ExecNode {
  build() {
    super.build();
    this.AddInputDataPin("Data", types.string);
  }

  get DataInputPin() {
    return this.InputDataPins[0];
  }

  Work() {
    console.log(this.DataInputPin.Data);
  }
}
