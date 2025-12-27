import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CreditHeader } from "@/components/socials";

const otilitoSans = localFont({
  src: [
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-Thin-BF68ad1f1064472.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-ExtraLight-BF68ad1f109df90.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-Light-BF68ad1f1070e2d.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-Regular-BF68ad1f10aa05e.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-Medium-BF68ad1f10df120.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-SemiBold-BF68ad1f107dd99.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-Bold-BF68ad1f0f39ef6.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/tt-otilito-sans-font-family-1764727023-0/TTOtilitoDemo-ExtraBold-BF68ad1f0f2e632.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-otilito",
});

export const metadata: Metadata = {
  title: "Aza Wrapped - Your Spending Story",
  description:
    "Discover your spending story with Aza Wrapped. Upload your bank statement and get a personalized year-in-review experience like Spotify Wrapped.",
  keywords: ["aza", "wrapped", "spending", "finance", "analysis", "opay"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${otilitoSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-otilito), system-ui, sans-serif' }}
      >
        <CreditHeader />
        {children}
      </body>
    </html>
  );
}
