import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "\uD68C\uC0AC \uC77C\uC815",
  description:
    "\uACF5\uAC1C \uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8\uC5D0\uC11C \uAC00\uC838\uC628 \uD68C\uC0AC \uC77C\uC815\uC785\uB2C8\uB2E4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
