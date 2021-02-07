import { BaseEngine } from "../classes";
import { SerializedEngine } from "../ipc";
import { PropertyType } from "../properties";
import IpcBus from "../services/EventService";

export interface PropertyData {
  name: string;
  type: PropertyType;
}

interface EngineData {
  name: string;
  properties: PropertyData[];
}

export class EngineManager {
  properties = [];

  constructor(public eventService: IpcBus) {}

  engineMetas = new Map<Function, EngineData>();
  engineInstances = new Map<string, BaseEngine>();

  registerEngine(engineConstructor: Function, name: string) {
    let engineData = this.engineMetas.get(engineConstructor);
    if (!engineData) {
      engineData = {
        name,
        properties: [],
      };
      this.engineMetas.set(engineConstructor, engineData);
    }

    engineData.name = name;
  }

  registerInstance(name: string, instance: BaseEngine) {
    this.engineInstances.set(name, instance);
  }

  registerProperty(
    engineConstructor: Function,
    name: string,
    type: PropertyType
  ) {
    let engineData = this.engineMetas.get(engineConstructor);
    if (!engineData) {
      engineData = {
        name,
        properties: [],
      };
      this.engineMetas.set(engineConstructor, engineData);
    }

    engineData.properties.push({ name, type });
  }

  serializeEngine(name: string): SerializedEngine {
    const engine = this.engineInstances.get(name);
    if (!engine) throw new Error(`Engine ${name} not initialized!`);
    const meta = this.engineMetas.get(engine.constructor);
    if (!meta) throw new Error(`Metadata for engine ${name} not found!`);

    return {
      pkg: engine.name,
      properties: meta.properties.map((p) => ({
        type: p.type.name as any,
        name: p.name,
        data: (engine as any)[p.name].data(),
      })),
    } as any;
  }

  serializeAll() {
    return [...this.engineInstances.keys()].map((k) => this.serializeEngine(k));
  }

  startAll() {
    return Promise.all(
      [...this.engineInstances.values()].map((i) => i.start())
    );
  }
}
