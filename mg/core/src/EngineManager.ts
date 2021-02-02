import { PropertyArgs } from "./decorators/Property";
import EventService from "./services/EventService";

class EngineData {
  name!: string;
  properties: { name: string; args: PropertyArgs }[] = [];

  constructor(public target: Function) {}
}

export class EngineManager {
  properties = [];

  constructor(public eventService: EventService) {}

  engines = new Map<Function, EngineData>();

  registerEngine(engineConstructor: Function, name: string) {
    let engineData = this.engines.get(engineConstructor);
    if (!engineData) {
      engineData = new EngineData(engineConstructor);
      this.engines.set(engineConstructor, engineData);
    }

    engineData.name = name;
  }

  registerProperty(
    engineConstructor: Function,
    propertyName: string,
    args: PropertyArgs
  ) {
    let engineData = this.engines.get(engineConstructor);
    if (!engineData) {
      engineData = new EngineData(engineConstructor);
      this.engines.set(engineConstructor, engineData);
    }

    engineData.properties.push({ name: propertyName, args });
  }
}
