import { autorun } from "mobx";
import { EventEmitter2 as EventEmitter } from "eventemitter2";

import { core, getEngineManager } from "..";
import { PropertyArgs } from "../decorators/Property";

export abstract class BaseEngine extends EventEmitter {
  name: string;

  constructor() {
    super();

    const data = getEngineManager().engines.get(this.constructor);
    if (!data)
      throw new Error(
        `Data for engine ${this.constructor.name} not found. Did you forget to use @Engine?`
      );

    this.name = data.name;

    data.properties.forEach(({ name, args }) => {
      this.initialiseProperty(name, args);
    });
  }

  initialiseProperty(name: string, args: PropertyArgs) {
    if (!args.selectFrom)
      core.EventService.on(
        `core:setProperty:midi:${name}`,
        ({ value }: any) => {
          (this as any)[name] = value;
        }
      );
    else {
      autorun(() => {
        core.EventService.emit(
          `${this.name}:properties:${name}`,
          (this as any)[name]
        );
      });
    }
  }

  abstract start(): Promise<void>;
}
