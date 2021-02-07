import type { SerializedEnum } from "@macrograph/core";

export class EnumStore {
  enums = new Map<string, string[]>();
  
  registerEnum(enumObj: SerializedEnum) {
    this.enums.set(enumObj.name, enumObj.values);
  }
}
