import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Placement Management System",
  description:
    "Centralised Placement Management and AI-Assisted Career Readiness System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}