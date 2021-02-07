import { Node, types, ValueNode } from "macrograph";
import type { PinType } from "@macrograph/core";

function createNodeVariants<T extends Record<string, PinType>>(
  classDeclaration: <K extends keyof T>(name: K, type: T[K]) => void,
  typeVariants: T
) {
  Object.entries(typeVariants).forEach(([typeName, typeVariant]) => {
    classDeclaration(typeName, typeVariant as any);
  });
}

createNodeVariants(
  (name, type) => {
    @Node({ displayName: `Subtract (${name})` })
    class Subtract extends ValueNode {
      build() {
        this.AddInputDataPin("", type);
        this.AddInputDataPin("", type);
        this.AddOutputDataPin("", type);
      }

      async Work() {
        this.OutputDataPins[0].Data =
          this.InputDataPins[0].Data - this.InputDataPins[1].Data;
      }
    }

    @Node({ displayName: `Add (${name})` })
    class Add extends ValueNode {
      build() {
        this.AddInputDataPin("", type);
        this.AddInputDataPin("", type);
        this.AddOutputDataPin("", type);
      }

      async Work() {
        this.OutputDataPins[0].Data =
          this.InputDataPins[0].Data + this.InputDataPins[1].Data;
      }
    }

    @Node({ displayName: `Multiply (${name})` })
    class Multiply extends ValueNode {
      build() {
        this.AddInputDataPin("", type);
        this.AddInputDataPin("", type);
        this.AddOutputDataPin("", type);
      }

      async Work() {
        this.OutputDataPins[0].Data =
          this.InputDataPins[0].Data * this.InputDataPins[1].Data;
      }
    }

    @Node({ displayName: `Divide (${name})` })
    class Divide extends ValueNode {
      build() {
        this.AddInputDataPin("", type);
        this.AddInputDataPin("", type);
        this.AddOutputDataPin("", type);
      }

      async Work() {
        const res = this.InputDataPins[0].Data * this.InputDataPins[1].Data;
        this.OutputDataPins[0].Data =
          type === types.int ? Math.trunc(res) : res;
      }
    }
  },
  { Integer: types.int, Float: types.float }
);
