import { Select } from "./Select";
import { Text } from "./Text";

export type PropertyType = typeof Select | typeof Text;

export abstract class EngineProperty {
  abstract data(): any;

  listeners: Function[] = [];

  onChange(callback: Function) {
    this.listeners.push(callback);
  }
}

export * from "./Select";
export * from "./Text";
