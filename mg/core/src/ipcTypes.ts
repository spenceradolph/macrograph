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

export declare interface RendererRequestsMap {
  CreateNode: {
    args: {
      position: {
        x: number;
        y: number;
      };
      pkg: string;
      name: string;
    };
    returns: SerializedNode;
  };
  DeleteNode: {
    args: {
      node: number;
    };
    returns: void;
  };
  SetNodePosition: {
    args: {
      id: number;
      position: {
        x: number;
        y: number;
      };
    };
    returns: void;
  };
  ConnectExecPins: {
    args: {
      from: {
        node: number;
        pin: string;
      };
      to: {
        node: number;
        pin: string;
      };
    };
    returns: void;
  };
  ConnectDataPins: {
    args: {
      from: {
        node: number;
        pin: string;
      };
      to: {
        node: number;
        pin: string;
      };
    };
    returns: void;
  };
  DisconnectPin: {
    args: {
      node: number;
      pin: string;
      exec: boolean;
      input: boolean;
    };
    returns: void;
  };
  UIReady: {
    args: {};
    returns: void;
  };
  SetUnconnectedData: {
    args: {
      node: number;
      pin: string;
      data: string | number | boolean;
    };
    returns: void;
  };
  RegisteredNodes: {
    args: {};
    returns: { pkg: string; nodes: string[] }[];
  };
}

export declare interface CoreEventsMap {
  NodeRegistered: {
    args: { pkg: string; name: string };
  };
}
