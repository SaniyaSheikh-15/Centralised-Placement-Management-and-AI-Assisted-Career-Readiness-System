import React from "react";

interface FormSuccessAlertProps {
  title?: string;
  message: string;
  variant?: "banner" | "simple";
}

export const FormSuccessAlert: React.FC<FormSuccessAlertProps> = ({
  title,
  message,
  variant = "banner",
}) => {
  if (variant === "simple") {
    return (
      <div className="flex items-center gap-[9px] p-[12px] mb-[18px] rounded-[10px] bg-[rgba(53,211,154,0.08)] border border-[rgba(53,211,154,0.22)] text-[#35d39a]">
        <span className="text-[15px]">✓</span>
        <p className="text-[10px] text-[#35d39a]">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[12px] p-[14px] mb-[20px] rounded-[11px] bg-[rgba(53,211,154,0.08)] border border-[rgba(53,211,154,0.22)] text-left">
      <div className="min-w-[30px] w-[30px] h-[30px] flex items-center justify-center rounded-full text-[#35d39a] bg-[rgba(53,211,154,0.12)]">
        ✓
      </div>
      <div>
        {title && <strong className="text-[12px] text-[#35d39a] block">{title}</strong>}
        <p className="text-[#8fa2bb] text-[10px] mt-[3px]">{message}</p>
      </div>
    </div>
  );
};

interface FormErrorAlertProps {
  message: string;
}

export const FormErrorAlert: React.FC<FormErrorAlertProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-[9px] p-[12px] mb-[18px] rounded-[10px] bg-[rgba(255,107,122,0.08)] border border-[rgba(255,107,122,0.22)] text-[#ff6b7a] text-left">
      <span className="text-[14px]">⚠</span>
      <p className="text-[10px] text-[#ff6b7a]">{message}</p>
    </div>
  );
};
