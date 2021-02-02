import { GraphStore } from "./GraphStore";
import { PackageStore } from "./PackageStore";
import { UIStore } from "./UIStore";

export class RootStore {
  graph = new GraphStore();
  ui = new UIStore();
  packages = new PackageStore();
}

export class BaseStore {
  constructor(public root: RootStore) {}
}
export const Store = new RootStore();