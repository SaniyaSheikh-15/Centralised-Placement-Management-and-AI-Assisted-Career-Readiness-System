import React from "react";
import Link from "next/link";

interface BrandHeaderProps {
  className?: string;
  size?: "default" | "large";
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  className = "",
  size = "default",
}) => {
  const isLarge = size === "large";

  return (
    <Link
      href="/auth/role-selection"
      className={`flex items-center gap-3 transition-opacity hover:opacity-95 ${
        isLarge ? "mb-[30px] text-[24px]" : "mb-[25px] text-[23px]"
      } font-extrabold tracking-[-0.5px] text-[#f4f7fb] ${className}`}
    >
      <span>
        Campus<span className="text-[#237cff]">Connect</span>
      </span>
    </Link>
  );
};
