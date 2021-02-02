import { PinTypes } from "@macrograph/core";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { usePin } from "../../hooks";
import { InputDataPin, Node, OutputDataPin } from "../../store/Nodes";

const colors = require("tailwindcss/colors");
const tc = ([variant]: TemplateStringsArray) => ({
  variant,
  color: colors[variant.split("-")[0]][variant.split("-")[1]],
});

export const TYPE_COLORS: Record<PinTypes, ReturnType<typeof tc>> = {
  Int: tc`teal-400`,
  Boolean: tc`red-600`,
  String: tc`pink-500`,
  Float: tc`green-500`,
  Enum: tc`blue-600`,
};

type Props = {
  node: Node;
  pin: InputDataPin | OutputDataPin;
} & ReturnType<typeof usePin>["props"];

const pinIsOutput = (pin: InputDataPin | OutputDataPin): pin is OutputDataPin =>
  pin instanceof OutputDataPin;

const Socket = observer<Props, HTMLDivElement>(
  ({ node, pin, ...props }, ref) => {
    const colorVariant = TYPE_COLORS[pin.type.type].variant;

    return (
      <div className="flex items-center space-x-2 h-6">
        {pinIsOutput(pin) && node.variant !== "Pure" && <p>{pin.name}</p>}
        <div
          ref={ref}
          {...props}
          className={clsx(
            `w-4 h-4 bg-transparent border-2 border-${colorVariant} hover:bg-${colorVariant}`,
            !pin.type.isArray && "rounded-full",
            (pin.selected || pin.connected) && `bg-${colorVariant}`
          )}
        />
        {!pinIsOutput(pin) && node.variant !== "Pure" && <p>{pin.name}</p>}
      </div>
    );
  },
  { forwardRef: true }
);

interface ContainerProps {
  node: Node;
  pin: InputDataPin | OutputDataPin;
}
const SockerContainer = ({ node, pin }: ContainerProps) => {
  const { ref, props } = usePin(pin);
  return <Socket ref={ref} pin={pin} node={node} {...props} />;
};

export default SockerContainer;
