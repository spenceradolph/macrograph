import clsx from "clsx";
import { forwardRef, SelectHTMLAttributes } from "react";

interface Props {
  options: string[];
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & Props
>(({ options, className, ...props }, ref) => {
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
});

export default Select;
