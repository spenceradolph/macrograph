import { BaseNode, Node, types, ValueNode } from "macrograph";
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
    @Node({ displayName: `Equal (${name})` })
    class Equal extends ValueNode {
      build() {
        this.AddInputDataPin("", type);
        this.AddInputDataPin("", type);
        this.AddOutputDataPin("Equal", types.boolean);
      }

      async Work() {
        this.OutputDataPins[0].Data =
          this.InputDataPins[0].Data === this.InputDataPins[1].Data;
      }
    }
  },
  {
    Integer: types.int,
    Float: types.float,
    Boolean: types.boolean,
    String: types.string,
  }
);

@Node({ displayName: "Branch" })
class Branch extends BaseNode {
  build() {
    this.AddInputExecPin("");
    this.AddInputDataPin("Condition", types.boolean);

    this.AddOutputExecPin("True");
    this.AddOutputExecPin("False");
  }

  async Work() {
    console.log(this.InputDataPins[0].Data)
    return this.InputDataPins[0].Data === true
      ? this.OutputExecPins[0].OutgoingPin?.Node.Process()
      : this.OutputExecPins[1].OutgoingPin?.Node.Process();
  }
}
