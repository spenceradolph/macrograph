/// <reference types="electron"/>

import { EventEmitter2 as EventEmitter } from "eventemitter2";
import { IObservableArray } from "mobx";

// export namespace macrograph {
//   const _PinTypes =
//     "Int" |
//     "Float" |
//     "Boolean" |
//     "String" |
//     "Enum" |
// "Any",
// "Primitive",
// "Union",
type PinTypes = "Int" | "Float" | "Boolean" | "String" | "Enum";

interface BaseType<Type extends PinTypes> {
  type: Type;
  isArray?: boolean;
}

interface IntType extends BaseType<"Int"> {}
interface FloatType extends BaseType<"Float"> {}
interface BooleanType extends BaseType<"Boolean"> {}
interface StringType extends BaseType<"String"> {}
interface EnumType extends BaseType<"Enum"> {
  enum: string;
}
// export interface PrimitiveType extends BaseType<"Primitive"> {}
// export interface AnyType extends BaseType<"Any"> {}
// export interface UnionType<T extends PinType[]> extends BaseType<"Union"> {
//   types: T;
// }

type PinType = IntType | FloatType | BooleanType | StringType | EnumType;

declare abstract class NodePin {
  constructor(Node: BaseNode, Name: string);

  Node: BaseNode;
  Name: string;
  ID: string;
  toString(): string;
  abstract Disconnect(): void;
  abstract get HasConnection(): boolean;
}

declare abstract class NodeDataPin extends NodePin {
  constructor(Node: BaseNode, Name: string, PinType: PinType);

  PinType: PinType;
  Data: any;

  toString(): string;
}

declare class NodeOutputDataPin extends NodeDataPin {
  Disconnect(): void;
  get HasConnection(): boolean;
}

declare class NodeInputDataPin extends NodeDataPin {
  Disconnect(): void;
  get HasConnection(): boolean;
}

declare abstract class NodeExecPin extends NodePin {}

declare class NodeOutputExecPin extends NodeExecPin {
  Disconnect(): void;
  get HasConnection(): boolean;
}

declare class NodeInputExecPin extends NodeExecPin {
  Disconnect(): void;
  get HasConnection(): boolean;
}

declare interface XYCoords {
  x: number;
  y: number;
}

declare interface PropertyArgs {
  selectFrom?: string;
}

declare module "macrograph" {
  export abstract class BaseNode {
    readonly InputDataPins: NodeInputDataPin[];
    readonly OutputDataPins: NodeOutputDataPin[];
    readonly InputExecPins: NodeInputExecPin[];
    readonly OutputExecPins: NodeOutputExecPin[];

    AddInputDataPin(Name: string, Type: PinType): void;
    AddInputExecPin(Name: string): void;
    AddOutputDataPin(Name: string, Type: PinType): void;
    AddOutputExecPin(Name: string): void;

    abstract build(): void;
    abstract Work(): void;

    constructor(ID: number, Position: XYCoords, Type: string);
  }

  export abstract class ExecNode extends BaseNode {
    build(): void;
  }

  export abstract class EventNode extends BaseNode {
    abstract Fire(EventData: any): void;
    Work(): void;

    Start(EventData: any): Promise<void>;

    build(): void;

    get ExecOutput1(): NodeOutputExecPin;
  }

  export abstract class ValueNode extends BaseNode {}

  export abstract class BaseEngine extends EventEmitter {
    abstract start(): Promise<void>;

    enums?: Record<string, object>;
  }

  export const Node: (args: {
    displayName: string;
    pkg?: string;
  }) => ClassDecorator;

  interface EngineDecoratorProps {
    enums?: Record<string, object>;
  }
  export const Engine: (
    name: string,
    props?: EngineDecoratorProps
  ) => ClassDecorator;
  export const Property: (args?: PropertyArgs) => PropertyDecorator;

  export const types: {
    int: IntType;
    float: FloatType;
    string: StringType;
    boolean: BooleanType;
    enum: (type: object) => EnumType;
    array: <T extends PinType>(type: T) => T;
    // any: { type: "Any", isArray: false } as AnyType,
    // primitive: { type: "Primitive", isArray: false } as PrimitiveType,
    // union: <T extends PinType[]>(...types: T): UnionType<T> => ({
    //   type: "Union",
    //   types,
    //   isArray: false,
    // }),
  };

  export class Select {
    value: string;
    options: string[];
    onChange(callback: Function): void;
  }

  export class Text {
    value: string;
    onChange(callback: Function): void;
  }
}
