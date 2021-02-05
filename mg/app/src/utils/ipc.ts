import { EventEmitter2 as EventEmitter } from "eventemitter2";
import type { ipcRenderer as ipcrt } from "electron";

const { ipcRenderer: ipcr } = window.require("electron");

export const ipcRenderer = ipcr as typeof ipcrt;

class IpcBus extends EventEmitter {
  constructor() {
    super({ wildcard: true, delimiter: ":" });
  }

  invoke(type: string, data: any = {}) {
    return ipcRenderer.invoke("IPC_RENDERER", { type, data });
  }
}

export const ipcBus = new IpcBus();

ipcRenderer.on(
  "IPC_MAIN",
  (_: unknown, { type, data }: { type: string; data: any }) => {
    ipcBus.emit(type, data);
  }
);
