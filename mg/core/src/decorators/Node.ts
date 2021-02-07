import { getCurrentManager } from "../managers/NodesManager";

export const Node = (args: {
  displayName: string;
  pkg?: string;
}): ClassDecorator => {
  const pkg = args.pkg;
  if (pkg === undefined)
    throw new Error(`'pkg' of node ${args.displayName} is undefined`);
  return (target) => {
    const manager = getCurrentManager();

    if (manager !== null)
      manager.RegisterNode({
        pkg,
        name: args.displayName,
        node: target as any,
      });
  };
};
