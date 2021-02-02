import { EventNode, Node, types, ValueNode } from "macrograph";
import type { PinType } from "@macrograph/core";

function createNodeVariants<T extends Record<string, PinType>>(
  classDeclaration: <K extends keyof T>(name: K, type: T[K]) => void,
  typeVariants: T
) {
  Object.entries(typeVariants).forEach(([typeName, typeVariant]) => {
    classDeclaration(typeName, typeVariant as any);
  });
}

@Node({ displayName: "Ticker" })
class Ticker extends EventNode {
  tick = 0;

  build() {
    super.build();
    this.AddOutputDataPin("Tick", types.int);

    setInterval(() => this.Start(null), 1000);
  }

  Fire() {
    this.OutputDataPins[0].Data = this.tick++;
  }
}
