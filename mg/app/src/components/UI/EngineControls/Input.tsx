import clsx from "clsx";
import { forwardRef, InputHTMLAttributes, useEffect, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string>(value || "");

    useEffect(() => {
      value && setInternalValue(value);
    }, [value]);

    return (
      <input
        className={clsx(
          "flex-1 pl-2 pr-8 py-1 rounded-sm block truncate min-w-0 bg-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500",
          className
        )}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={onChange}
        value={internalValue}
        ref={ref}
        {...props}
      />
    );
  }
);

export default Input;
