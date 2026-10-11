"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  hint?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  hint,
  autoComplete,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-[46px] px-[14px] pr-[45px] rounded-[10px] border border-[#1b304b] bg-[#091525] text-[#f4f7fb] text-[13px] font-sans outline-none placeholder-[#50637a] transition-all duration-200 focus:border-[#237cff] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(35,124,255,0.10)] ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 border-none bg-transparent text-[#8fa2bb] hover:text-white cursor-pointer text-[15px] p-0 flex items-center justify-center select-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {hint && (
        <small className="block mt-[6px] text-[#61748c] text-[10px]">
          {hint}
        </small>
      )}

      {error && (
        <small className="block text-[#ff6b7a] text-[10px] mt-[5px]">
          {error}
        </small>
      )}
    </div>
  );
};
