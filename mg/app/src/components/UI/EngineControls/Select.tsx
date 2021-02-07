import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { SelectHTMLAttributes } from "react";

interface Props {
  options: string[];
}

const Select = observer<
  SelectHTMLAttributes<HTMLSelectElement> & Props,
  HTMLSelectElement
>(
  ({ options, className, ...props }, ref) => {
    return (
      <select
        className={clsx(
          "flex-1 pl-2 pr-8 py-1 rounded-sm block truncate min-w-0 bg-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  },
  { forwardRef: true }
);

export default Select;
