import { ExecNode, Node, types, PinType } from "macrograph";

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
    @Node({ displayName: `Log (${name})` })
    class Log extends ExecNode {
      build() {
        super.build()
        this.AddInputDataPin("Data", type);
      }

      async Work() {
        console.log(this.InputDataPins[0].Data.toString());
      }
    }
  },
  {
    Integer: types.int,
    Float: types.float,
    String: types.string,
    Boolean: types.boolean,
  }
);
