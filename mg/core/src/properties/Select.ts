import { IObservableArray, observable, reaction, toJS } from "mobx";
import { EngineProperty } from ".";

export interface Select extends IObservableArray {
  value: string;
}

export class Select extends EngineProperty {
  private _options = observable<string>([]);

  get options() {
    return this._options;
  }
  set options(v: string[]) {
    this._options.replace(v);
  }

  @observable value = "";

  data() {
    return {
      value: this.value,
      options: toJS(this.options),
    };
  }

  constructor() {
    super();
    this._options.intercept((c) => {
      if (this.options.length === 0) {
        if (c.type === "update") {
          this.value = c.newValue;
        } else if (c.added.length > 0 && c.type === "splice") {
          this.value = c.added[0];
        }
      } else if (
        c.type === "splice" &&
        c.removedCount === this.options.length
      ) {
        this.value = "";
      }

      return c;
    });

    reaction(
      () => this.value,
      (value) => this.listeners.forEach((l) => l(value))
    );
  }
}
