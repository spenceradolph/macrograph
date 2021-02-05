import { core } from ".";
import { PinType } from "./nodes";

export declare type NodeType = "Base" | "Exec" | "Pure" | "Event";
export declare interface XYCoords {
  x: number;
  y: number;
}

export declare interface SerializedNode {
  pins: {
    exec: {
      in: {
        name: string;
        id: string;
        node: number;
        connection?: {
          nodeId: number;
          pin: string;
        };
      }[];
      out: {
        name: string;
        id: string;
        node: number;
        connection?: {
          nodeId: number;
          pin: string;
        };
      }[];
    };
    data: {
      in: {
        name: string;
        id: string;
        node: number;
        type: PinType;
        connection?: {
          nodeId: number;
          pin: string;
        };
      }[];
      out: {
        name: string;
        id: string;
        node: number;
        type: PinType;
        connections: {
          nodeId: number;
          pin: string;
        }[];
      }[];
    };
  };
  position: XYCoords;
  id: number;
  type: {
    pkg: string;
    name: string;
  };
  variant: NodeType;
  displayName: string;
}

export interface EngineProperties {
  Select: {
    options: string[];
    value: string;
  };
  Text: {
    value: string;
  };
}

export interface SerializedEngineProperty<T extends keyof EngineProperties> {
  type: T;
  name: string;
  data: EngineProperties[T];
}

export declare interface SerializedEngine {
  pkg: string;
  properties: SerializedEngineProperty<keyof EngineProperties>[];
}
