"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "← Back to role selection",
  onClick,
  href,
  className = "",
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (href) {
      e.preventDefault();
      router.push(href);
    } else {
      e.preventDefault();
      router.push("/auth/role-selection");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`border-none bg-transparent text-[#8fa2bb] hover:text-[#4b94ff] text-[12px] cursor-pointer p-0 mb-[25px] transition-colors duration-200 block text-left ${className}`}
    >
      {label}
    </button>
  );
};
