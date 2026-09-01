import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "w-full h-[46px] px-[14px] rounded-[10px] border border-[#1b304b] bg-[#091525] text-[#f4f7fb] text-[13px] font-sans outline-none placeholder-[#50637a] transition-all duration-200 focus:border-[#237cff] focus:shadow-[0_0_0_3px_rgba(35,124,255,0.10)]",
            error && "border-[#ff6b7a]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <small className="block text-[#ff6b7a] text-[10px] mt-[5px] text-left">
            {error}
          </small>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
