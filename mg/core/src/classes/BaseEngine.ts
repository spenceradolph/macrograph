import { EventEmitter2 as EventEmitter } from "eventemitter2";
import { reaction } from "mobx";

import { core, getEngineManager } from "..";
import { PropertyData } from "../managers/EngineManager";
import { Select, Text } from "../properties";
export abstract class BaseEngine extends EventEmitter {
  name: string;

  abstract enums?: Record<string, object>;

  constructor() {
    super();

    const meta = getEngineManager().engineMetas.get(this.constructor);
    if (!meta)
      throw new Error(
        `Metadata for engine ${this.constructor.name} not found. Did you forget to use @Engine?`
      );

    this.name = meta.name;

    getEngineManager().registerInstance(this.name, this);
    meta.properties.forEach((propertyData) => {
      this.initialiseProperty(propertyData);
    });
  }

  initialiseProperty(data: PropertyData) {
    const self = this as any;
    switch (data.type) {
      case Select: {
        const property = new Select();
        self[data.name] = property;
        reaction(
          () => property.options.slice(),
          (options) => {
            core.ipcBus.send(
              `engines:${this.name}:properties:${data.name}:setOptions`,
              [...options]
            );
          }
        );
        reaction(
          () => property.value,
          (value) => {
            core.ipcBus.send(
              `engines:${this.name}:properties:${data.name}:setValue`,
              value
            );
          }
        );
        break;
      }
      case Text: {
        const property = new Text();
        self[data.name] = property;

        reaction(
          () => property.value,
          (value) =>
            core.ipcBus.send(
              `engines:${this.name}:properties:${data.name}:setValue`,
              value
            )
        );
        break;
      }
    }
  }

  abstract start(): Promise<void>;
}
