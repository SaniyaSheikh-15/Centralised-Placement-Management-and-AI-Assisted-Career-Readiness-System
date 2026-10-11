"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { FormErrorAlert, FormSuccessAlert } from "@/components/auth/FormAlert";
import { OtpInput } from "@/components/auth/OtpInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { StepProgressBar } from "@/components/auth/StepProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "@/lib/validation";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Email Form State
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Step 2: Verification Code State
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Step 3: Reset Password State
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalResetError, setGeneralResetError] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  /* Step 1: Submit Email */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      setEmailError("Email address is required.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setIsEmailLoading(true);

    try {
      await authApi.forgotPassword({ email: trimmedEmail });
      setIsEmailLoading(false);
      setStep(2);
    } catch (err: unknown) {
      setIsEmailLoading(false);
      if (err instanceof ApiError) {
        setEmailError(err.message);
      } else {
        setEmailError("Failed to send reset code. Please try again.");
      }
    }
  };

  /* Step 2: Resend OTP */
  const handleResendCode = async () => {
    if (resendStatus === "sending" || resendStatus === "sent") return;

    setResendStatus("sending");
    setResendMessage(null);
    setOtpError(null);

    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      setResendStatus("sent");
      setResendMessage(res.message || "Reset code resent to your email.");

      setTimeout(() => {
        setResendStatus("idle");
      }, 5000);
    } catch (err: unknown) {
      setResendStatus("idle");
      if (err instanceof ApiError) {
        setOtpError(err.message);
      } else {
        setOtpError("Failed to resend code.");
      }
    }
  };

  /* Step 2: Submit OTP */
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }

    setIsOtpLoading(true);

    try {
      await authApi.verifyOtp({
        email: email.trim(),
        otp: fullOtp,
        purpose: "PASSWORD_RESET",
      });

      setIsOtpLoading(false);
      setStep(3);
    } catch (err: unknown) {
      setIsOtpLoading(false);
      if (err instanceof ApiError) {
        setOtpError(err.message);
      } else {
        setOtpError("Invalid verification code. Please try again.");
      }
    }
  };

  /* Step 3: Submit New Password */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralResetError(null);

    let isValid = true;

    if (newPassword === "") {
      setNewPasswordError("New password is required.");
      isValid = false;
    } else if (!PASSWORD_PATTERN.test(newPassword)) {
      setNewPasswordError(
        "Password must contain 8 characters and at least one number."
      );
      isValid = false;
    }

    if (confirmNewPassword === "") {
      setConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    setIsResetLoading(true);

    try {
      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.join(""),
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      });

      setIsResetLoading(false);
      setStep(4);
    } catch (err: unknown) {
      setIsResetLoading(false);
      if (err instanceof ApiError) {
        setGeneralResetError(err.message);
      } else {
        setGeneralResetError("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <AuthLayout centerContent>
      <section className="w-full max-w-[500px] p-[35px_40px] max-[600px]:p-[28px_20px] rounded-[22px] max-[600px]:rounded-[18px] border border-[#1b304b] bg-gradient-to-br from-[rgba(15,28,46,0.97)] to-[rgba(8,18,32,0.97)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]">
        {/* =================================
             STEP 1 : EMAIL
        ================================== */}
        {step === 1 && (
          <div>
            <BackButton
              label="← Back to login"
              onClick={() => router.push("/auth/login")}
            />

            <div className="text-center mb-[25px]">
              <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[22px] bg-[rgba(35,124,255,0.12)] border border-[rgba(35,124,255,0.25)] select-none">
                🔑
              </div>
              <p className="text-[#4b94ff] text-[10px] font-bold tracking-[1.5px] mb-[8px] uppercase">
                ACCOUNT RECOVERY
              </p>
              <h1 className="text-[27px] max-[600px]:text-[23px] font-extrabold mb-[9px] text-[#f4f7fb]">
                Forgot your password?
              </h1>
              <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
                Don&apos;t worry. Enter your registered email address and we&apos;ll help you reset your password.
              </p>
            </div>

            <StepProgressBar currentStep={1} />

            <form onSubmit={handleEmailSubmit} noValidate>
              <div className="mb-[20px]">
                <Label htmlFor="resetEmail">Email Address</Label>
                <Input
                  type="email"
                  id="resetEmail"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  error={emailError}
                />
              </div>

              <Button
                type="submit"
                disabled={isEmailLoading}
                isLoading={isEmailLoading}
              >
                Continue →
              </Button>
            </form>

            <p className="text-center text-[#8fa2bb] text-[10px] mt-[20px]">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-[#4b94ff] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}

        {/* =================================
             STEP 2 : VERIFICATION
        ================================== */}
        {step === 2 && (
          <div>
            <BackButton label="← Back" onClick={() => setStep(1)} />

            <div className="text-center mb-[25px]">
              <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[22px] bg-[rgba(35,124,255,0.12)] border border-[rgba(35,124,255,0.25)] select-none">
                📩
              </div>
              <p className="text-[#4b94ff] text-[10px] font-bold tracking-[1.5px] mb-[8px] uppercase">
                VERIFY EMAIL
              </p>
              <h1 className="text-[27px] max-[600px]:text-[23px] font-extrabold mb-[9px] text-[#f4f7fb]">
                Check your email
              </h1>
              <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
                We&apos;ve sent a 6-digit verification code to{" "}
                <strong className="text-[#dce8f7] font-bold">{email || "your email"}</strong>.
              </p>
            </div>

            <StepProgressBar currentStep={2} />

            {resendMessage && (
              <FormSuccessAlert variant="simple" message={resendMessage} />
            )}

            <form onSubmit={handleOtpSubmit} noValidate>
              <div className="mb-[20px]">
                <label className="block text-[12px] font-semibold mb-[7px] text-[#dbe5f2] text-left">
                  Verification Code
                </label>
                <OtpInput
                  value={otp}
                  onChange={(newOtp) => {
                    setOtp(newOtp);
                    if (otpError) setOtpError(null);
                  }}
                  error={otpError}
                />
              </div>

              <Button
                type="submit"
                disabled={isOtpLoading}
                isLoading={isOtpLoading}
              >
                Verify Code →
              </Button>
            </form>

            <div className="flex justify-center gap-[5px] mt-[20px] text-[#8fa2bb] text-[10px]">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendStatus === "sending" || resendStatus === "sent"}
                className="border-none bg-transparent text-[#4b94ff] text-[10px] font-semibold cursor-pointer hover:underline disabled:opacity-80 disabled:no-underline"
              >
                {resendStatus === "sending"
                  ? "Sending..."
                  : resendStatus === "sent"
                  ? "Code Sent ✓"
                  : "Resend Code"}
              </button>
            </div>
          </div>
        )}

        {/* =================================
             STEP 3 : NEW PASSWORD
        ================================== */}
        {step === 3 && (
          <div>
            <div className="text-center mb-[25px]">
              <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[22px] bg-[rgba(35,124,255,0.12)] border border-[rgba(35,124,255,0.25)] select-none">
                🔐
              </div>
              <p className="text-[#4b94ff] text-[10px] font-bold tracking-[1.5px] mb-[8px] uppercase">
                CREATE NEW PASSWORD
              </p>
              <h1 className="text-[27px] max-[600px]:text-[23px] font-extrabold mb-[9px] text-[#f4f7fb]">
                Set a new password
              </h1>
              <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
                Create a strong password that you haven&apos;t used before.
              </p>
            </div>

            <StepProgressBar currentStep={3} />

            {generalResetError && <FormErrorAlert message={generalResetError} />}

            <form onSubmit={handlePasswordSubmit} noValidate>
              {/* New Password */}
              <div className="mb-[20px]">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Enter new password"
                  hint="Minimum 8 characters with at least one number."
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError(null);
                  }}
                  error={newPasswordError}
                />
              </div>

              {/* Confirm New Password */}
              <div className="mb-[20px]">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmNewPassword"
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError(null);
                  }}
                  error={confirmPasswordError}
                />
              </div>

              <Button
                type="submit"
                disabled={isResetLoading}
                isLoading={isResetLoading}
              >
                Reset Password →
              </Button>
            </form>
          </div>
        )}

        {/* =================================
             STEP 4 : SUCCESS
        ================================== */}
        {step === 4 && (
          <div className="text-center py-[25px]">
            <div className="w-[70px] h-[70px] mx-auto mb-[20px] flex items-center justify-center rounded-full text-[#35d39a] bg-[rgba(53,211,154,0.10)] border border-[rgba(53,211,154,0.25)] text-[30px]">
              ✓
            </div>
            <p className="text-[#4b94ff] text-[10px] font-bold tracking-[1.5px] mb-[8px] uppercase">
              PASSWORD UPDATED
            </p>
            <h1 className="text-[25px] max-[600px]:text-[22px] font-extrabold mb-[10px] text-[#f4f7fb]">
              Password reset successful!
            </h1>
            <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
              Your password has been changed successfully. You can now login using your new password.
            </p>

            <div className="mt-[25px]">
              <Button
                type="button"
                onClick={() => router.push("/auth/login")}
              >
                Continue to Login →
              </Button>
            </div>
          </div>
        )}
      </section>
    </AuthLayout>
  );
}
