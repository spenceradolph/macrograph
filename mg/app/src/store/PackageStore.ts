import { action, observable } from "mobx";

class Package {
  nodes = observable(new Set<string>());
  
  engine = ob

  constructor(public name: string) {}

  @action
  registerNode(name: string) {
    this.nodes.add(name);
  }
}

export class PackageStore {
  packages = observable(new Map<string, Package>());

  @action
  registerNode(args: { pkg: string; name: string }) {
    const pkg = this.packages.get(args.pkg);

    if (pkg) pkg.nodes.add(args.name);
    else {
      const pkg = new Package(args.pkg);
      pkg.registerNode(args.name);
      this.packages.set(args.pkg, pkg);
    }
  }

  @action
  registerPackage(args: { pkg: string; nodes: string[] }) {
    args.nodes.forEach((n) => this.registerNode({ pkg: args.pkg, name: n }));
  }
}
