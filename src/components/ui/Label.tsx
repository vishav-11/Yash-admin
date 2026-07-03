import React from "react";
import { cn } from "@/utils/cn.utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({ className, required, children, ...props }: LabelProps) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-slate-700 mb-1.5",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

export { Label };