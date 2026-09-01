import React from "react";
import { BrandHeader } from "./BrandHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
  brandSize?: "default" | "large";
  centerContent?: boolean;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  brandSize = "default",
  centerContent = false,
  className = "",
}) => {
  return (
    <main
      className={`min-h-screen flex flex-col items-center px-[20px] py-[35px] max-[600px]:px-[14px] max-[600px]:py-[25px] relative z-10 ${
        centerContent ? "justify-center" : ""
      } ${className}`}
    >
      <BrandHeader size={brandSize} />
      {children}
      <p className="mt-[20px] text-[10px] max-[600px]:text-[10px] text-[#52647b] text-center">
        © 2026 CampusConnect · Placement Management System
      </p>
    </main>
  );
};
