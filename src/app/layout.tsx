import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudentProfileProvider } from "@/features/student-profile/context/StudentProfileContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CampusConnect — Student Profile Builder",
  description: "Manage your career profile, skills, projects, certifications, and resume for campus placements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StudentProfileProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </StudentProfileProvider>
      </body>
    </html>
  );
}
