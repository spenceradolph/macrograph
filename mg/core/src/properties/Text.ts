import { observable, reaction } from "mobx";
import { EngineProperty } from ".";

export class Text extends EngineProperty {
  @observable value = "";

  data() {
    return { value: this.value };
  }

  constructor() {
    super();

    reaction(
      () => this.value,
      (value) => this.listeners.forEach((l) => l(value))
    );
  }
}
