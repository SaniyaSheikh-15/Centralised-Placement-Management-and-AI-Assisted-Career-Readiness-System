"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BackButton } from "@/components/auth/BackButton";
import { FormErrorAlert, FormSuccessAlert } from "@/components/auth/FormAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TpoAccessForm } from "@/types/auth";
import { EMAIL_PATTERN, PHONE_PATTERN } from "@/lib/validation";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function TpoAccessPage() {
  const [form, setForm] = useState<TpoAccessForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "",
    designation: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonText, setButtonText] = useState("Submit Access Request →");

  const handleChange = (field: keyof TpoAccessForm, value: string) => {
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
    setGeneralError(null);
    const newErrors: Record<string, string> = {};

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const institution = form.institution.trim();
    const designation = form.designation;
    const reason = form.reason.trim();

    /* First Name */
    if (firstName === "") {
      newErrors.firstName = "First name is required.";
    }

    /* Last Name */
    if (lastName === "") {
      newErrors.lastName = "Last name is required.";
    }

    /* Email */
    if (email === "") {
      newErrors.email = "Institutional email is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    /* Phone */
    if (phone === "") {
      newErrors.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    /* Institution */
    if (institution === "") {
      newErrors.institution = "Institution name is required.";
    }

    /* Designation */
    if (designation === "") {
      newErrors.designation = "Please select your designation.";
    }

    /* Reason */
    if (reason === "") {
      newErrors.reason = "Please provide a reason for requesting access.";
    } else if (reason.length < 10) {
      newErrors.reason = "Please provide a little more information.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await authApi.requestTPAccess({
        first_name: firstName,
        last_name: lastName || null,
        official_email: email,
        contact_number: phone || null,
        institution_name: institution,
        designation: designation || null,
        reason_for_access: reason || null,
      });

      setIsLoading(false);
      setIsSuccess(true);
      setButtonText("Request Submitted ✓");
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An error occurred while submitting your request. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <section className="w-full max-w-[620px] p-[35px_40px] max-[600px]:p-[28px_20px] rounded-[22px] max-[600px]:rounded-[18px] border border-[#1b304b] bg-gradient-to-br from-[rgba(15,28,46,0.97)] to-[rgba(8,18,32,0.97)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px]">
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <div className="text-center mb-[25px]">
          <div className="w-[55px] h-[55px] mx-auto mb-[15px] flex items-center justify-center rounded-[15px] text-[23px] bg-[rgba(118,87,255,0.12)] border border-[rgba(118,87,255,0.25)] select-none">
            🏛️
          </div>
          <p className="text-[#4b94ff] text-[11px] font-bold tracking-[1.5px] mb-[8px] uppercase">
            T&P OFFICER ACCESS
          </p>
          <h1 className="text-[27px] max-[600px]:text-[23px] font-extrabold mb-[9px] text-[#f4f7fb]">
            Request Institutional Access
          </h1>
          <p className="text-[#8fa2bb] text-[13px] leading-[1.6]">
            T&P Officer accounts require verification and approval from the institution administrator.
          </p>
        </div>

        {/* Approval Info Box */}
        <div className="flex items-start gap-[12px] p-[15px] mb-[25px] rounded-[12px] bg-[rgba(118,87,255,0.08)] border border-[rgba(118,87,255,0.22)] text-left">
          <div className="min-w-[32px] w-[32px] h-[32px] flex items-center justify-center rounded-[9px] bg-[rgba(118,87,255,0.15)] text-[15px] select-none">
            🔐
          </div>
          <div>
            <strong className="block text-[#c8bcff] text-[12px] mb-[4px]">
              Admin approval required
            </strong>
            <p className="text-[#8fa2bb] text-[10px] leading-[1.5]">
              Your request will be reviewed by the authorized institution administrator before access is granted.
            </p>
          </div>
        </div>

        {/* General Error Alert */}
        {generalError && <FormErrorAlert message={generalError} />}

        {/* Success Alert */}
        {isSuccess && (
          <FormSuccessAlert
            title="Access request submitted!"
            message="Your request is now pending institutional approval."
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name Row */}
          <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[15px] max-[600px]:gap-0">
            <div className="mb-[17px]">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                placeholder="First name"
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
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
              />
            </div>
          </div>

          {/* Official Email */}
          <div className="mb-[17px]">
            <Label htmlFor="email">Official Institutional Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="name@college.edu"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
            />
            <small className="block mt-[6px] text-[#61748c] text-[10px]">
              Please use your official college/institution email.
            </small>
          </div>

          {/* Phone */}
          <div className="mb-[17px]">
            <Label htmlFor="phone">Contact Number</Label>
            <Input
              type="tel"
              id="phone"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
            />
          </div>

          {/* Institution */}
          <div className="mb-[17px]">
            <Label htmlFor="institution">Institution / College Name</Label>
            <Input
              type="text"
              id="institution"
              placeholder="Enter institution name"
              value={form.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              error={errors.institution}
            />
          </div>

          {/* Designation Select */}
          <div className="mb-[17px]">
            <Label htmlFor="designation">Designation</Label>
            <Select
              id="designation"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              error={errors.designation}
            >
              <option value="">Select your designation</option>
              <option value="Training & Placement Officer">Training &amp; Placement Officer</option>
              <option value="Assistant T&P Officer">Assistant T&amp;P Officer</option>
              <option value="Placement Coordinator">Placement Coordinator</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {/* Reason */}
          <div className="mb-[17px]">
            <Label htmlFor="reason">Reason for Access</Label>
            <Textarea
              id="reason"
              rows={4}
              placeholder="Briefly explain why you require access to the placement management system..."
              value={form.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              error={errors.reason}
            />
          </div>

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
            Already have approved access?{" "}
            <Link
              href="/auth/login"
              className="text-[#4b94ff] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </section>
    </AuthLayout>
  );
}
