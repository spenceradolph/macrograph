import { getEngineManager } from "..";
import {} from "../classes";
import { PropertyType, Text, Select } from "../properties";

const isPropertyType = (type: any): type is PropertyType => {
  return [Select, Text].includes(type);
};

export const Property = (): PropertyDecorator => {
  return (target: any, propertyName) => {
    if (typeof propertyName !== "string")
      throw new Error("Property name can't be a symbol!");

    const manager = getEngineManager();

    const type = Reflect.getMetadata("design:type", target, propertyName);

    if (!isPropertyType(type))
      throw new Error(
        `Type ${type} of property ${propertyName} is not a valid property type`
      );

    manager.registerProperty(target.constructor, propertyName, type);
  };
};
