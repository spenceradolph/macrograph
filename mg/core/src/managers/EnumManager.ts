import { SerializedEnum } from "..";
import IpcBus from "../services/EventService";

export class EnumManager {
  enums = new Map<string, object>();

  constructor(public EventService: IpcBus) {}

  registerEnum(name: string, enumObject: object) {
    Reflect.defineMetadata("design:enumName", name, enumObject);

    this.enums.set(name, enumObject);
  }

  serializeEnums(): SerializedEnum[] {
    return [...this.enums.entries()].map(([name, e]) => ({
      name,
      values: Object.keys(e).filter((k) => !(parseInt(k) >= 0)),
    }));
  }
}
