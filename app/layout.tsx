// app/layout.tsx
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import ToastContainer from "@/components/ui/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio Admin",
    template: "%s | Portfolio Admin",
  },
  description: "Admin panel for managing portfolio content",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning on body bhi lagao —
        browser extensions (cz-shortcut-listen) body attributes
        modify karte hain jo hydration mismatch cause karta hai
      */}
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}