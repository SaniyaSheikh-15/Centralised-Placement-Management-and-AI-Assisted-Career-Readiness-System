"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string | null;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const sanitized = rawVal.replace(/[^0-9]/g, "");
    const lastChar = sanitized.slice(-1);

    const newOtp = [...value];
    newOtp[index] = lastChar;
    onChange(newOtp);

    if (lastChar && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...value];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    onChange(newOtp);

    const targetFocusIndex = Math.min(pasteData.length, 5);
    inputsRef.current[targetFocusIndex]?.focus();
  };

  return (
    <div>
      <div className="flex justify-center gap-[9px] max-[600px]:gap-[6px]">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-[50px] max-[600px]:w-[42px] h-[52px] max-[600px]:h-[48px] p-0 text-center text-[18px] font-bold rounded-[10px] border border-[#1b304b] bg-[#091525] text-[#f4f7fb] outline-none transition-all duration-200 focus:border-[#237cff] focus:shadow-[0_0_0_3px_rgba(35,124,255,0.10)]"
          />
        ))}
      </div>
      {error && (
        <small className="block text-[#ff6b7a] text-[10px] mt-[5px] text-center">
          {error}
        </small>
      )}
    </div>
  );
};
