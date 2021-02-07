import { core, getEngineManager } from "..";

interface Props {
  enums?: Record<string, object>;
}
export const Engine = (name: string, props: Props = {}): ClassDecorator => {
  if (props.enums) {
    for (let key in props.enums) {
      core.EnumManager.registerEnum(key, props.enums[key]);
    }
  }

  return (target) => {
    const manager = getEngineManager();

    manager.registerEngine(target, name);
  };
};
