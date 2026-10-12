"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { FormErrorAlert, FormSuccessAlert } from "@/components/auth/FormAlert";
import { OtpInput } from "@/components/auth/OtpInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentRegistrationForm } from "@/types/auth";
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  PASSWORD_PATTERN,
} from "@/lib/validation";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function StudentRegistrationPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState<StudentRegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState("Create Student Account →");

  // Step 2: Verification State
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleChange = (field: keyof StudentRegistrationForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const newErrors: Record<string, string> = {};

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const terms = form.terms;

    /* First Name */
    if (firstName === "") {
      newErrors.firstName = "First name is required.";
    } else if (firstName.length < 2) {
      newErrors.firstName = "Enter a valid first name.";
    }

    /* Last Name */
    if (lastName === "") {
      newErrors.lastName = "Last name is required.";
    }

    /* Email */
    if (email === "") {
      newErrors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    /* Phone */
    if (phone === "") {
      newErrors.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    /* Password */
    if (password === "") {
      newErrors.password = "Password is required.";
    } else if (!PASSWORD_PATTERN.test(password)) {
      newErrors.password = "Password must contain 8 characters and at least one number.";
    }

    /* Confirm Password */
    if (confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    /* Terms */
    if (!terms) {
      newErrors.terms = "Please accept the Terms & Conditions.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await authApi.registerStudent({
        first_name: firstName,
        last_name: lastName || null,
        email: email,
        phone: phone || null,
        password: password,
        role: "student",
      });

      setIsLoading(false);
      setStep(2);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    }
  };

  /* Step 2: Handle OTP Verification */
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setGeneralError(null);

    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      await authApi.verifyEmail({
        email: form.email.trim(),
        otp: fullOtp,
      });

      setIsVerifying(false);
      setIsSuccess(true);
      setButtonText("Verified ✓");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: unknown) {
      setIsVerifying(false);
      if (err instanceof ApiError) {
        setOtpError(err.message);
      } else {
        setOtpError("Failed to verify code. Please try again.");
      }
    }
  };

  /* Step 2: Resend Verification Code */
  const handleResendCode = async () => {
    if (resendStatus === "sending" || resendStatus === "sent") return;

    setResendStatus("sending");
    setResendMessage(null);
    setOtpError(null);

    try {
      const res = await authApi.resendVerification({
        email: form.email.trim(),
      });
      setResendStatus("sent");
      setResendMessage(res.message || "Verification code sent to your email.");

      setTimeout(() => {
        setResendStatus("idle");
      }, 5000);
    } catch (err: unknown) {
      setResendStatus("idle");
      if (err instanceof ApiError) {
        setOtpError(err.message);
      } else {
        setOtpError("Failed to resend verification code.");
      }
    }
  };

  return (
    <AuthLayout>
      <section className="w-full max-w-[620px] p-[35px_40px] max-[600px]:p-[28px_20px] rounded-[22px] max-[600px]:rounded-[18px] border border-[#1b304b] bg-gradient-to-br from-[rgba(15,28,46,0.97)] to-[rgba(8,18,32,0.97)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]">
        {/* Back Button */}
        {step === 1 ? (
          <BackButton />
        ) : (
          <BackButton label="← Back to details" onClick={() => setStep(1)} />
        )}

        {/* Header */}
        <div className="text-center mb-[27px]">
          <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[23px] bg-[rgba(35,124,255,0.12)] border border-[rgba(35,124,255,0.25)] select-none">
            {step === 1 ? "🎓" : "📩"}
          </div>
          <p className="text-[#4b94ff] text-[11px] font-bold tracking-[1.5px] mb-[8px] uppercase">
            {step === 1 ? "STUDENT REGISTRATION" : "VERIFY EMAIL"}
          </p>
          <h1 className="text-[28px] max-[600px]:text-[24px] font-extrabold mb-[9px] text-[#f4f7fb]">
            {step === 1 ? "Create your account" : "Check your email"}
          </h1>
          <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
            {step === 1 ? (
              "Register to access placement opportunities, applications and career resources."
            ) : (
              <>
                We&apos;ve sent a 6-digit verification code to{" "}
                <strong className="text-[#dce8f7] font-bold">{form.email || "your email"}</strong>.
              </>
            )}
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && <FormErrorAlert message={generalError} />}

        {/* Resend Success Message */}
        {resendMessage && (
          <FormSuccessAlert variant="simple" message={resendMessage} />
        )}

        {/* Success Alert */}
        {isSuccess && (
          <FormSuccessAlert
            title="Registration & verification successful!"
            message="Your student account has been verified. Redirecting to login..."
          />
        )}

        {/* Step 1: Form */}
        {step === 1 && (
          <form onSubmit={handleRegisterSubmit} noValidate>
            {/* Name Row */}
            <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[15px] max-[600px]:gap-0">
              <div className="mb-[17px]">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  error={errors.firstName}
                />
              </div>

              <div className="mb-[17px]">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  error={errors.lastName}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-[17px]">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
              />
            </div>

            {/* Phone */}
            <div className="mb-[17px]">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                maxLength={10}
                placeholder="Enter 10-digit phone number"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
              />
            </div>

            {/* Password */}
            <div className="mb-[17px]">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                hint="Minimum 8 characters with at least one number."
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={errors.password}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-[17px]">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-[9px] mt-[5px]">
              <Checkbox
                id="terms"
                checked={form.terms}
                onChange={(e) => handleChange("terms", e.target.checked)}
                className="mt-[3px]"
              />
              <label
                htmlFor="terms"
                className="text-[#8fa2bb] text-[10px] leading-[1.5] cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#4b94ff] hover:underline"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#4b94ff] hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {errors.terms && (
              <small className="block text-[#ff6b7a] text-[10px] mt-[5px] mb-[10px] text-left">
                {errors.terms}
              </small>
            )}

            {/* Submit Button */}
            <div className="mt-[17px]">
              <Button
                type="submit"
                disabled={isLoading || isSuccess}
                isLoading={isLoading}
              >
                {buttonText}
              </Button>
            </div>

            {/* Login Link */}
            <p className="text-center text-[#8fa2bb] text-[11px] mt-[20px]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#4b94ff] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
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
              disabled={isVerifying || isSuccess}
              isLoading={isVerifying}
            >
              {isSuccess ? buttonText : "Verify Code →"}
            </Button>

            <div className="flex justify-center gap-[5px] mt-[20px] text-[#8fa2bb] text-[10px]">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendStatus === "sending" || resendStatus === "sent" || isSuccess}
                className="border-none bg-transparent text-[#4b94ff] text-[10px] font-semibold cursor-pointer hover:underline disabled:opacity-80 disabled:no-underline"
              >
                {resendStatus === "sending"
                  ? "Sending..."
                  : resendStatus === "sent"
                  ? "Code Sent ✓"
                  : "Resend Code"}
              </button>
            </div>

            <p className="text-center text-[#8fa2bb] text-[11px] mt-[20px]">
              Already verified?{" "}
              <Link
                href="/auth/login"
                className="text-[#4b94ff] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </section>
    </AuthLayout>
  );
}
