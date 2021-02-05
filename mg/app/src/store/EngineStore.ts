import { action, observable, reaction } from "mobx";
import { SerializedEngine } from "@macrograph/core";
import { ipcBus } from "../utils";

abstract class BaseProperty {
  constructor(public engine: string, public name: string) {
    this.setup();
  }

  abstract setup(): void;
}

export class SelectProperty extends BaseProperty {
  @observable value = "";

  options = observable<string>([]);

  setup() {
    ipcBus.on(
      `engines:${this.engine}:properties:${this.name}:setValue`,
      (value) => (this.value = value)
    );
    ipcBus.on(
      `engines:${this.engine}:properties:${this.name}:setOptions`,
      (options) => this.options.replace(options)
    );

    reaction(
      () => this.value,
      (value) => {
        ipcBus.invoke(
          `engines:${this.engine}:properties:${this.name}:setValue`,
          value
        );
      },
    );
  }
}

export class TextProperty extends BaseProperty {
  @observable value = "";

  setup() {
    ipcBus.on(
      `engines:${this.engine}:properties:${this.name}:setValue`,
      (value) => (this.value = value)
    );

    reaction(
      () => this.value,
      (value) => {
        ipcBus.invoke(
          `engines:${this.engine}:properties:${this.name}:setValue`,
          value
        );
      }
    );
  }
}

type EngineProperty = SelectProperty | TextProperty;

class Engine {
  properties = observable(new Map<string, EngineProperty>());

  constructor(public name: string) {}
}

export class EngineStore {
  engines = observable(new Map<string, Engine>());

  @action
  registerEngine(engine: SerializedEngine) {
    const e = new Engine(engine.pkg);

    for (let p of engine.properties) {
      let property: EngineProperty;

      switch (p.type) {
        case "Select":
          let sp = new SelectProperty(engine.pkg, p.name);

          sp.options.replace((p.data as any).options);
          sp.value = p.data.value;

          property = sp;
          break;
        case "Text":
          let tp = new TextProperty(engine.pkg, p.name);

          tp.value = p.data.value;

          property = tp;
          break;
      }

      e.properties.set(p.name, property);
    }

    this.engines.set(e.name, e);
  }
}
