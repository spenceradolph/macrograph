export const PinTypes = [
  "Int",
  "Float",
  "Boolean",
  "String",
  "Enum",
  // "Any",
  // "Primitive",
  // "Union",
] as const;
export type PinTypes = typeof PinTypes[number];

interface BaseType<Type extends PinTypes> {
  type: Type;
  isArray?: boolean;
}

export interface IntType extends BaseType<"Int"> {}
export interface FloatType extends BaseType<"Float"> {}
export interface BooleanType extends BaseType<"Boolean"> {}
export interface StringType extends BaseType<"String"> {}
export interface EnumType extends BaseType<"Enum"> {
  enumType: string;
}
// export interface PrimitiveType extends BaseType<"Primitive"> {}
// export interface AnyType extends BaseType<"Any"> {}
// export interface UnionType<T extends PinType[]> extends BaseType<"Union"> {
//   types: T;
// }

export type PinType = IntType | FloatType | BooleanType | StringType | EnumType;
// | AnyType
// | PrimitiveType
// | UnionType<any>;

export const types = {
  int: { type: "Int", isArray: false } as IntType,
  float: { type: "Float", isArray: false } as FloatType,
  string: { type: "String", isArray: false } as StringType,
  enum: (enumType: string): EnumType => ({
    type: "Enum",
    enumType,
    isArray: false,
  }),
  boolean: { type: "Boolean", isArray: false } as BooleanType,
  // any: { type: "Any", isArray: false } as AnyType,
  // primitive: { type: "Primitive", isArray: false } as PrimitiveType,
  array: <T extends PinType>(type: T): T => ({
    ...type,
    isArray: true,
  }),
  // union: <T extends PinType[]>(...types: T): UnionType<T> => ({
  //   type: "Union",
  //   types,
  //   isArray: false,
  // }),
};

// const isUnion = (type: PinType): type is UnionType<any[]> =>
//   type.type === "Union";

export const typesCompatible = (type1: PinType, type2: PinType): boolean => {
  if (type1.isArray !== type2.isArray) return false;

  // if (isUnion(type1))
  //   return type1.types.every((t) => typesCompatible(t, type2));

  // if (isUnion(type2))
  //   return type2.types.every((t) => typesCompatible(type1, t));

  switch (type1.type) {
    // case "Any":
    // return true;
    case "Enum":
      return type2.type === "Enum" && type1.enumType === type2.enumType;
    // case "Primitive":
    //   return ["Int", "Float", "Boolean", "String", "Primitive"].includes(
    //     type2.type
    //   );
    default:
      return type1.type === type2.type;
  }
};

export function typeDefault(type: PinType) {
  switch (type.type) {
    case "Int":
    case "Float":
    case "Enum":
      return 0;
    case "Boolean":
      return true;
    case "String":
      return "";
    // case ""
    default:
      throw new Error("Type has no default?");
  }
}
