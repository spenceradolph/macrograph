import "reflect-metadata";
import { EventEmitter2 } from "eventemitter2";
import _NodesManager, { setCurrentManager } from "./managers/NodesManager";
import { EngineManager } from "./managers/EngineManager";
import { EnumManager } from "./managers/EnumManager";
import { Project } from "./Project";
import IpcBus from "./services/EventService";
import { BrowserWindow } from "electron";

export * from "./nodes";
export * from "./ipc";
export * from "./decorators";
export * from "./properties";
export * from "./classes";

EventEmitter2.defaultMaxListeners = 9999;

import "./customRequire";

export const createBrowserWindow = (args: any) => new BrowserWindow(args);

export class Core {
  // Services
  ipcBus = new IpcBus();
  NodesManager = new _NodesManager(this.ipcBus);
  EngineManager = new EngineManager(this.ipcBus);
  EnumManager = new EnumManager(this.ipcBus);

  Project: Project;

  constructor() {
    this.Project = new Project(this.NodesManager, this.ipcBus);
    setCurrentManager(this.NodesManager);
  }
}

export const core = new Core();
export const getEngineManager = () => core.EngineManager;
