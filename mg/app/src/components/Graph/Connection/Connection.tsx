import { XYCoords } from "@macrograph/core";
import { observer } from "mobx-react-lite";
import { DataConnection, ExecConnection } from "../../../store/Nodes";
import { TYPE_COLORS } from "../Socket";

interface ConnectionProps {
  connection: DataConnection | ExecConnection;
  svgOffset: XYCoords;
}
const Connection = observer(({ connection, svgOffset }: ConnectionProps) => {
  const color =
    connection instanceof DataConnection
      ? TYPE_COLORS[connection.type.type].color
      : "#FFF";

  return (
    <line
      x1={connection.path.x1 - svgOffset.x}
      y1={connection.path.y1 - svgOffset.y}
      x2={connection.path.x2 - svgOffset.x}
      y2={connection.path.y2 - svgOffset.y}
      stroke={color}
      strokeOpacity={0.75}
      strokeWidth={2}
    />
  );
});

export default Connection;
