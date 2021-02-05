import { observable, toJS } from "mobx";
import { EngineProperty } from ".";

export class Text extends EngineProperty {
  @observable value = "";

  data() {
    return { value: this.value };
  }
}
