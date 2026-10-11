import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold transition-all duration-250 disabled:opacity-65 disabled:cursor-not-allowed disabled:transform-none select-none outline-none",
  {
    variants: {
      variant: {
        default:
          "w-full h-[48px] rounded-[10px] bg-gradient-to-br from-[#237cff] to-[#7657ff] text-white text-[13px] shadow-[0_10px_30px_rgba(35,124,255,0.20)] hover:-translate-y-[1px] hover:shadow-[0_14px_35px_rgba(35,124,255,0.30)] active:translate-y-0",
        outline:
          "border border-[#1b304b] bg-transparent text-[#8fa2bb] hover:text-[#4b94ff] hover:border-[#237cff]",
        ghost:
          "border-none bg-transparent text-[#8fa2bb] hover:text-[#4b94ff] p-0 text-[12px] font-normal",
      },
      size: {
        default: "h-[48px] px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="loader-spinner" />
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
