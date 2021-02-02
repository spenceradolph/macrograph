import { observable } from "mobx";
import { getEngineManager } from "..";

export interface PropertyArgs {
  selectFrom?: string;
}

export const Property = (args: PropertyArgs): PropertyDecorator => {
  return (target: any, propertyName) => {
    if (typeof propertyName !== "string")
      throw new Error("Property name can't be a symbol!");

    const manager = getEngineManager();

    if (target[propertyName])
      manager.registerProperty(target.constructor, propertyName, args);

    return observable(target, propertyName);
  };
};
