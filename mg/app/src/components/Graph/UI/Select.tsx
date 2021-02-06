import { useState } from "react";
import clsx from "clsx";

interface Props {
  options: string[];
  value: string;
  className?: string;
}

const Select = ({ className, value }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx("relative bg-gray-700 flex-shrink", className)}>
      <button
        className="w-full h-6 p-1 rounded-md"
        onClick={() => setOpen(!open)}
      >
        <span className="block truncate">{value}</span>
      </button>
    </div>
  );
};

export default Select;
