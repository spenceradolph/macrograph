import "reflect-metadata";
import _NodesManager, { setCurrentManager } from "./NodesManager";
import { EngineManager } from "./EngineManager";
import { Project } from "./Project";
import IpcBus from "./services/EventService";
import { BrowserWindow } from "electron";
export * from "./nodes";
export * from "./ipc";
export * from "./decorators";
export * from "./properties";
export * from "./classes";

import "./customRequire";

export const createBrowserWindow = (args: any) => new BrowserWindow(args);

export class Core {
  // Services
  ipcBus = new IpcBus();
  NodesManager = new _NodesManager(this.ipcBus);
  EngineManager = new EngineManager(this.ipcBus);

  Project: Project;

  constructor() {
    this.Project = new Project(this.NodesManager, this.ipcBus);
    setCurrentManager(this.NodesManager);
  }
}

export const core = new Core();
export const getEngineManager = () => core.EngineManager;
