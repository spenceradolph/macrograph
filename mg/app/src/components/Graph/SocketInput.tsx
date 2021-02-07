import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { forwardRef, useState } from "react";
import { Store } from "../../store";

import { InputDataPin } from "../../store/Nodes";

interface Props {
  pin: InputDataPin;
}
const SocketInput = observer(({ pin }: Props) => {
  if (pin.type.isArray) return null;

  switch (pin.type.type) {
    case "Int":
      return (
        <IntegerInput
          className={clsx(
            "w-14 px-1 bg-black rounded-md border border-gray-400",
            pin.connected && "opacity-0 pointer-events-none"
          )}
          onChange={(num) => pin.setUnconnectedData(num)}
          initialValue={pin.unconnectedData as number}
        />
      );
    case "Float":
      return (
        <FloatInput
          className={clsx(
            "w-14 px-1 bg-black rounded-md border border-gray-400",
            pin.connected && "opacity-0 pointer-events-none"
          )}
          onChange={(num) => pin.setUnconnectedData(num)}
          initialValue={pin.unconnectedData as number}
        />
      );
    case "Boolean":
      return (
        <BooleanInput
          initialValue={pin.unconnectedData as boolean}
          className={clsx(
            "w-4 bg-black rounded-md border border-gray-400",
            pin.connected && "opacity-0 pointer-events-none"
          )}
          onChange={(checked) => pin.setUnconnectedData(checked)}
        />
      );
    case "String":
      return (
        <StringInput
          onChange={(v) => pin.setUnconnectedData(v)}
          className={
            pin.connected ? "opacity-0 pointer-events-none" : undefined
          }
          initialValue={pin.unconnectedData as string}
        />
      );
    case "Enum":
      const enumVals = Store.enums.enums.get(pin.type.enum);
      if (!enumVals) return null;

      return (
        <select
          className="w-32 bg-black rounded-md py-0 px-1 pr-8"
          value={pin.unconnectedData as number}
          onChange={(e) => pin.setUnconnectedData(parseInt(e.target.value))}
        >
          {enumVals.map((v, i) => (
            <option key={v} value={i}>
              {v.replace("_", " ")}
            </option>
          ))}
        </select>
      );
  }
});

export default SocketInput;

const StringInput = forwardRef<
  HTMLInputElement,
  { onChange(value: string): void; className?: string; initialValue?: string }
>(({ onChange, initialValue, className, ...props }, ref) => {
  const [value, setValue] = useState(initialValue || "");

  return (
    <input
      className={clsx(
        "w-16 px-1 bg-black rounded-md border border-gray-400",
        className
      )}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      onBlur={(e) => onChange(e.target.value)}
    />
  );
});

const IntRegex = /^[0-9]*$/;
const IntegerInput = forwardRef<
  HTMLInputElement,
  { onChange(value: number): void; className: string; initialValue?: number }
>(({ onChange, initialValue, ...props }, ref) => {
  const [value, setValue] = useState(initialValue?.toString() || "0");

  return (
    <input
      ref={ref}
      value={value}
      {...props}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        if (!IntRegex.test(e.target.value)) return;
        setValue(e.target.value);
      }}
      onBlur={(e) => {
        let num = parseInt(e.target.value);
        if (!isNaN(num)) onChange(num);
        else {
          setValue("0");
          onChange(0);
        }
      }}
    />
  );
});

const FloatRegex = /^[0-9]*[.]?[0-9]*$/;
const FloatInput = forwardRef<
  HTMLInputElement,
  { onChange(value: number): void; className: string; initialValue?: number }
>(({ onChange, initialValue, ...props }, ref) => {
  const [value, setValue] = useState(initialValue?.toString() || "0");

  return (
    <input
      ref={ref}
      value={value}
      {...props}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        if (!FloatRegex.test(e.target.value)) return;
        setValue(e.target.value);
      }}
      onBlur={(e) => {
        if (e.target.value.includes(".")) {
          let split = e.target.value.split(".");
          if (split[1] === "") {
            setValue(split[0]);
            onChange(parseInt(split[0]));
          }
        }

        let num = parseFloat(e.target.value);
        if (!isNaN(num)) onChange(num);
        else {
          setValue("0");
          onChange(0);
        }
      }}
    />
  );
});

const BooleanInput = forwardRef<
  HTMLInputElement,
  { onChange(value: boolean): void; className: string; initialValue?: boolean }
>(({ onChange, initialValue, ...props }, ref) => {
  const [value, setValue] = useState(initialValue || false);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={value}
      {...props}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        setValue(e.target.checked);
        onChange(e.target.checked);
      }}
    />
  );
});
