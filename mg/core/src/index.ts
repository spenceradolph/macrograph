import "reflect-metadata";
import _NodesManager, { setCurrentManager } from "./NodesManager";
import { EngineManager } from "./EngineManager";
import { Project } from "./Project";
import _EventService from "./services/EventService";
import { BrowserWindow } from "electron";
export * from "./nodes";
export * from "./ipcTypes";
export * from "./decorators";

import "./customRequire";

export const createBrowserWindow = (args: any) => new BrowserWindow(args);

export class Core {
  // Services
  EventService = new _EventService();
  NodesManager = new _NodesManager(this.EventService);
  EngineManager = new EngineManager(this.EventService);

  Project: Project;

  constructor() {
    this.Project = new Project(this.NodesManager, this.EventService);
    setCurrentManager(this.NodesManager);
  }
}

export const core = new Core();
export const getEngineManager = () => core.EngineManager;
