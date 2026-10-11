import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusConnect | Placement Management System",
  description: "Centralised Placement Management & AI-Assisted Career Readiness System",
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
