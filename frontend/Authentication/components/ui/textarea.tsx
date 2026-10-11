import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "w-full min-h-[95px] p-[12px_14px] rounded-[10px] border border-[#1b304b] bg-[#091525] text-[#f4f7fb] text-[13px] font-sans outline-none placeholder-[#50637a] resize-y transition-all duration-200 focus:border-[#237cff] focus:shadow-[0_0_0_3px_rgba(35,124,255,0.10)]",
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
Textarea.displayName = "Textarea";

export { Textarea };
