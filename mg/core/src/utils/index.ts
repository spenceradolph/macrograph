import { BaseNode } from "../nodes/Nodes";
import {
  NodeInputDataPin,
  NodeInputExecPin,
  NodeOutputDataPin,
  NodeOutputExecPin,
} from "../nodes/Pins";

export const CheckExecRecursion = (
  from: NodeOutputExecPin,
  to: NodeInputExecPin
): boolean => {
  const fromNode = from.Node;
  const toNode = to.Node;

  let nodesToCheck = toNode.OutputExecPins.filter((p) => p.HasConnection).map(
    (p) => p.Node
  );

  while (nodesToCheck.length > 0) {
    const checkingNode = nodesToCheck.pop()!;

    if (checkingNode === fromNode) return true;

    nodesToCheck = [
      ...nodesToCheck,
      ...checkingNode.OutputExecPins.filter((p) => p.HasConnection).map(
        (p) => p.OutgoingPin!.Node
      ),
    ];
  }

  return false;
};

export const CheckDataRecursion = (
  from: NodeOutputDataPin,
  to: NodeInputDataPin
): boolean => {
  const fromNode = from.Node;
  const toNode = to.Node;

  let nodesToCheck = toNode.OutputDataPins.filter((p) => p.HasConnection).map(
    (p) => p.Node
  );

  while (nodesToCheck.length > 0) {
    const checkingNode = nodesToCheck.pop()!;

    if (checkingNode === fromNode) return true;

    nodesToCheck = [
      ...nodesToCheck,
      ...checkingNode.OutputDataPins.filter((p) => p.HasConnection).reduce<
        BaseNode[]
      >((acc, p) => [...acc, ...p.OutgoingPins.map((p) => p.Node)], []),
    ];
  }

  return false;
};
