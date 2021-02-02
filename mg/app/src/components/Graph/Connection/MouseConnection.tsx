import { XYCoords } from "@macrograph/core";
import { observer } from "mobx-react-lite";
import { Store } from "../../../store";
import { InputDataPin, OutputDataPin } from "../../../store/Nodes";
import { TYPE_COLORS } from "../Socket";

interface MouseConnectionProps {
  svgOffset: XYCoords;
}
const MouseConnection = observer(({ svgOffset }: MouseConnectionProps) => {
  const mousePath = Store.ui.mousePath;
  const draggingPin = Store.ui.draggingPin;

  const color =
    draggingPin instanceof InputDataPin ||
    draggingPin instanceof OutputDataPin
      ? TYPE_COLORS[draggingPin.type.type].color
      : "#FFF";

  if (!mousePath) return null;

  return (
    <line
      x1={mousePath.x1 - svgOffset.x}
      y1={mousePath.y1 - svgOffset.y}
      x2={mousePath.x2 - svgOffset.x}
      y2={mousePath.y2 - svgOffset.y}
      stroke={color}
      strokeOpacity={0.75}
      strokeWidth={2}
    />
  );
});

export default MouseConnection;
