import type * as macrograph from "macrograph";
import { Engine, Property } from "./decorators";
import {
  NodeDataPin,
  NodeInputDataPin,
  NodeOutputDataPin,
  NodeExecPin,
  NodeInputExecPin,
  NodeOutputExecPin,
  NodePin,
} from "./nodes/Pins";
import { Node } from "./decorators";
import { types } from "./nodes/PinTypes";
import { BaseNode, EventNode, ExecNode, ValueNode } from "./nodes/Nodes";
import { BaseEngine } from "./classes";
import { Select, Text } from "./properties";

(() => {
  const Mod = require("module");
  const _require = Mod.prototype.require;
  (Mod as any).prototype.require = function (path: string) {
    if (path === "macrograph")
      return {
        Node,
        EventNode,
        ExecNode,
        BaseNode,
        ValueNode,
        types,
        Engine,
        Property,
        NodeDataPin,
        NodeInputDataPin,
        NodeOutputDataPin,
        NodeExecPin,
        NodeInputExecPin,
        NodeOutputExecPin,
        NodePin,
        BaseEngine,
        Select,
        Text,
      } as typeof macrograph;

    return _require.apply(this, arguments);
  };
})();
