import React from "react";

interface SecurityNoteProps {
  message?: string;
  className?: string;
}

export const SecurityNote: React.FC<SecurityNoteProps> = ({
  message = "Your information is securely handled by the Placement Management System.",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 mt-[25px] pt-[20px] border-t border-white/[0.06] ${className}`}
    >
      <span className="text-[14px]">🔒</span>
      <p className="text-[#6f829c] text-[11px] max-[600px]:text-[9px] leading-[1.5]">
        {message}
      </p>
    </div>
  );
};
