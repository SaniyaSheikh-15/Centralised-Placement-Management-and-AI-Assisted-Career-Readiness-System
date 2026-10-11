import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-[12px] font-semibold mb-[7px] text-[#dbe5f2] text-left",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
