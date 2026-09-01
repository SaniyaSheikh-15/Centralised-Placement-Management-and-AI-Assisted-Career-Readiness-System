import React from "react";

interface StepProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Verify" },
    { number: 3, label: "Reset" },
  ];

  return (
    <div className="flex items-center justify-center my-[25px] mb-[30px]">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isPastOrCurrent = isCompleted || isActive;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-[5px] min-w-[45px]">
              <span
                className={`w-[29px] h-[29px] flex items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-200 ${
                  isPastOrCurrent
                    ? "bg-[#237cff] border border-[#237cff] text-white"
                    : "bg-[#091525] border border-[#1b304b] text-[#60738b]"
                }`}
              >
                {isCompleted ? "✓" : step.number}
              </span>
              <small
                className={`text-[8px] font-medium transition-colors duration-200 ${
                  isPastOrCurrent ? "text-[#4b94ff]" : "text-[#60738b]"
                }`}
              >
                {step.label}
              </small>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-[55px] max-[600px]:w-[35px] h-[1px] mb-[17px] transition-colors duration-200 ${
                  currentStep > step.number ? "bg-[#237cff]" : "bg-[#1b304b]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
