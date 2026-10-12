"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SecurityNote } from "@/components/auth/SecurityNote";
import { UserRole } from "@/types/auth";

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleSelectRole = (role: UserRole) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedRole", role);
    }

    if (role === "student") {
      router.push("/auth/student-registration");
    } else if (role === "recruiter") {
      router.push("/auth/recruiter-registration");
    } else if (role === "tpo") {
      router.push("/auth/tpo-access");
    }
  };

  return (
    <AuthLayout brandSize="large" centerContent>
      <section className="w-full max-w-[720px] p-[42px] max-[600px]:p-[28px_20px] rounded-[22px] max-[600px]:rounded-[18px] border border-[#1b304b] bg-gradient-to-br from-[rgba(15,28,46,0.96)] to-[rgba(8,18,32,0.96)] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[20px] text-center">
        {/* Welcome Icon */}
        <div className="w-[58px] h-[58px] mx-auto mb-[18px] flex items-center justify-center rounded-[16px] bg-gradient-to-br from-[rgba(35,124,255,0.25)] to-[rgba(118,87,255,0.25)] border border-[rgba(61,140,255,0.25)] select-none">
          <GraduationCap
          size={28}
          strokeWidth={1.8}
          className="text-[#4b94ff]"
          />
          </div>

        <p className="text-[#3d8cff] text-[12px] font-bold tracking-[1.5px] mb-[10px] uppercase">
          PLACEMENT MANAGEMENT SYSTEM
        </p>

        <h1 className="text-[30px] max-[600px]:text-[24px] font-extrabold leading-[1.2] mb-[12px] text-[#f4f7fb]">
          Welcome to CampusConnect
        </h1>

        <p className="text-[#8fa2bb] text-[14px] leading-[1.6] mb-[30px]">
          Select your role to continue to the placement management portal.
        </p>

        {/* Roles Container */}
        <div className="flex flex-col gap-[14px] text-left">
          {/* Student */}
          <button
            type="button"
            onClick={() => handleSelectRole("student")}
            className="w-full flex items-start gap-[18px] p-[20px] max-[600px]:p-[16px] rounded-[16px] border border-[#1b304b] bg-[rgba(13,25,41,0.8)] text-[#f4f7fb] cursor-pointer text-left transition-all duration-250 hover:-translate-y-[2px] hover:border-[rgba(35,124,255,0.65)] hover:bg-[#12223a] hover:shadow-[0_12px_35px_rgba(35,124,255,0.10)] group"
          >
            <div className="min-w-[52px] w-[52px] h-[52px] max-[600px]:min-w-[45px] max-[600px]:w-[45px] max-[600px]:h-[45px] flex items-center justify-center rounded-[14px] text-[23px] max-[600px]:text-[20px] bg-[rgba(35,124,255,0.13)] border border-[rgba(35,124,255,0.22)] select-none">
              🎓
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-bold mb-[7px] text-[#f4f7fb]">
                Student
              </h2>
              <p className="text-[#8fa2bb] text-[13px] max-[600px]:text-[12px] leading-[1.6] mb-[10px]">
                Access placements, applications, career guidance and interview opportunities.
              </p>
              <span className="inline-block text-[#3d8cff] text-[12px] font-semibold">
                Continue as Student →
              </span>
            </div>
          </button>

          {/* Recruiter */}
          <button
            type="button"
            onClick={() => handleSelectRole("recruiter")}
            className="w-full flex items-start gap-[18px] p-[20px] max-[600px]:p-[16px] rounded-[16px] border border-[#1b304b] bg-[rgba(13,25,41,0.8)] text-[#f4f7fb] cursor-pointer text-left transition-all duration-250 hover:-translate-y-[2px] hover:border-[rgba(35,124,255,0.65)] hover:bg-[#12223a] hover:shadow-[0_12px_35px_rgba(35,124,255,0.10)] group"
          >
            <div className="min-w-[52px] w-[52px] h-[52px] max-[600px]:min-w-[45px] max-[600px]:w-[45px] max-[600px]:h-[45px] flex items-center justify-center rounded-[14px] text-[23px] max-[600px]:text-[20px] bg-[rgba(118,87,255,0.13)] border border-[rgba(118,87,255,0.22)] select-none">
              💼
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-bold mb-[7px] text-[#f4f7fb]">
                Recruiter
              </h2>
              <p className="text-[#8fa2bb] text-[13px] max-[600px]:text-[12px] leading-[1.6] mb-[10px]">
                Post job opportunities, view candidates and manage recruitment drives.
              </p>
              <span className="inline-block text-[#3d8cff] text-[12px] font-semibold">
                Continue as Recruiter →
              </span>
            </div>
          </button>

          {/* T&P Officer */}
          <button
            type="button"
            onClick={() => handleSelectRole("tpo")}
            className="w-full flex items-start gap-[18px] p-[20px] max-[600px]:p-[16px] rounded-[16px] border border-[#1b304b] bg-[rgba(13,25,41,0.8)] text-[#f4f7fb] cursor-pointer text-left transition-all duration-250 hover:-translate-y-[2px] hover:border-[rgba(35,124,255,0.65)] hover:bg-[#12223a] hover:shadow-[0_12px_35px_rgba(35,124,255,0.10)] group"
          >
            <div className="min-w-[52px] w-[52px] h-[52px] max-[600px]:min-w-[45px] max-[600px]:w-[45px] max-[600px]:h-[45px] flex items-center justify-center rounded-[14px] text-[23px] max-[600px]:text-[20px] bg-[rgba(43,178,160,0.10)] border border-[rgba(43,178,160,0.20)] select-none">
              🏛️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-[10px] flex-wrap mb-[7px]">
                <h2 className="text-[17px] font-bold text-[#f4f7fb]">
                  T&P Officer
                </h2>
                <span className="px-[9px] py-[5px] rounded-[20px] text-[9px] font-bold tracking-[0.3px] text-[#c3b8ff] bg-[rgba(118,87,255,0.13)] border border-[rgba(118,87,255,0.25)]">
                  Approval Required
                </span>
              </div>
              <p className="text-[#8fa2bb] text-[13px] max-[600px]:text-[12px] leading-[1.6] mb-[10px]">
                Manage placements and institutional activities. Access requires admin approval.
              </p>
              <span className="inline-block text-[#3d8cff] text-[12px] font-semibold">
                Request Access →
              </span>
            </div>
          </button>
        </div>

        {/* Security Footer */}
        <SecurityNote />
      </section>
    </AuthLayout>
  );
}
