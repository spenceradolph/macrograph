import { getEngineManager } from "..";

export const Engine = (name: string): ClassDecorator => {
  return (target) => {
    const manager = getEngineManager();

    manager.registerEngine(target, name);
  };
};
