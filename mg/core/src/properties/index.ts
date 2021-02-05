import { Select } from "./Select";
import { Text } from "./Text";

export type PropertyType = typeof Select | typeof Text;

export abstract class EngineProperty {
  abstract data(): any;
}

export * from "./Select";
export * from "./Text";
