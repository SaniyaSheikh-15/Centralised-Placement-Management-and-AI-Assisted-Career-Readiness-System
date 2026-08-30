import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | null;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "w-full h-[46px] px-[14px] rounded-[10px] border border-[#1b304b] bg-[#091525] text-[#8fa2bb] text-[13px] font-sans outline-none cursor-pointer transition-all duration-200 focus:border-[#237cff] focus:shadow-[0_0_0_3px_rgba(35,124,255,0.10)]",
            error && "border-[#ff6b7a]",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <small className="block text-[#ff6b7a] text-[10px] mt-[5px] text-left">
            {error}
          </small>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
