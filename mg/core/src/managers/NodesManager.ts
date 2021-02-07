import { BaseNode } from "../nodes/Nodes";
import IpcBus from "../services/EventService";

export default class NodesManager {
  private nodes: Map<string, Map<string, typeof BaseNode>>;

  constructor(public EventService: IpcBus) {
    this.nodes = new Map();
  }

  AllNodes() {
    return [...this.nodes.entries()].map(([pkg, nodesMap]) => ({
      pkg,
      nodes: [...nodesMap.keys()],
    }));
  }

  RegisterNode(args: { pkg: string; name: string; node: typeof BaseNode }) {
    if (this.nodes.has(args.pkg))
      this.nodes.get(args.pkg)!.set(args.name, args.node);
    else this.nodes.set(args.pkg, new Map([[args.name, args.node]]));
  }

  GetNode(args: { pkg: string; name: string }) {
    const pkg = this.nodes.get(args.pkg);
    if (pkg === undefined) throw new Error(`Package ${args.pkg} not found!`);

    const node = pkg.get(args.name);
    if (node === undefined)
      throw new Error(`Node ${args.pkg}.${args.name} not found!`);

    return node;
  }
}

let currentManager: NodesManager | null = null;

export const getCurrentManager = () => currentManager;
export const setCurrentManager = (newManager: NodesManager | null) =>
  (currentManager = newManager);
