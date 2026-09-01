"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { FormErrorAlert, FormSuccessAlert } from "@/components/auth/FormAlert";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SecurityNote } from "@/components/auth/SecurityNote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginForm } from "@/types/auth";
import { EMAIL_PATTERN } from "@/lib/validation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState("Login →");

  const handleChange = (field: keyof LoginForm, value: string | boolean) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setGeneralError(null);

    const email = form.email.trim();
    const password = form.password;

    /* Email Validation */
    if (email === "") {
      newErrors.email = "Email address is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    /* Password Validation */
    if (password === "") {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await login(
        {
          email,
          password,
        },
        form.remember
      );

      setIsLoading(false);
      setIsSuccess(true);
      setButtonText("Login Successful ✓");

      setTimeout(() => {
        router.push("/auth/role-selection");
      }, 1200);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <AuthLayout centerContent>
      <section className="w-full max-w-[450px] p-[35px_40px] max-[600px]:p-[28px_20px] rounded-[22px] max-[600px]:rounded-[18px] border border-[#1b304b] bg-gradient-to-br from-[rgba(15,28,46,0.97)] to-[rgba(8,18,32,0.97)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]">
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <div className="text-center mb-[28px]">
          <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[22px] bg-[rgba(35,124,255,0.12)] border border-[rgba(35,124,255,0.25)] select-none">
            🔐
          </div>
          <p className="text-[#4b94ff] text-[10px] font-bold tracking-[1.5px] mb-[8px] uppercase">
            PLACEMENT MANAGEMENT SYSTEM
          </p>
          <h1 className="text-[28px] max-[600px]:text-[24px] font-extrabold mb-[9px] text-[#f4f7fb]">
            Welcome back
          </h1>
          <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
            Login to access your CampusConnect account.
          </p>
        </div>

        {/* General Error Message */}
        {generalError && <FormErrorAlert message={generalError} />}

        {/* Success Message */}
        {isSuccess && (
          <FormSuccessAlert variant="simple" message="Login successful!" />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-[20px]">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
            />
          </div>

          {/* Password */}
          <div className="mb-[20px]">
            <div className="flex items-center justify-between mb-[7px] max-[600px]:gap-[10px]">
              <label
                htmlFor="password"
                className="text-[12px] font-semibold text-[#dbe5f2]"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[#4b94ff] text-[10px] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
            />
          </div>

          {/* Remember Me */}
          <div className="mt-[-5px] mb-[20px]">
            <label
              htmlFor="remember"
              className="flex items-center gap-[8px] text-[#8fa2bb] text-[11px] cursor-pointer select-none"
            >
              <Checkbox
                id="remember"
                checked={form.remember}
                onChange={(e) => handleChange("remember", e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            isLoading={isLoading}
          >
            {buttonText}
          </Button>

          {/* Register Link */}
          <div className="flex justify-center gap-[5px] mt-[20px] text-[#8fa2bb] text-[11px]">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/auth/role-selection"
              className="text-[#4b94ff] font-semibold hover:underline"
            >
              Register
            </Link>
          </div>
        </form>

        {/* Security Note */}
        <SecurityNote message="Your login information is securely handled by the Placement Management System." />
      </section>
    </AuthLayout>
  );
}
