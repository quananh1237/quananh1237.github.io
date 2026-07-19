"use client";

import React, { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import DashboardShell from "../components/dashboard/DashboardShell";
import "../app/globals.css";

const ThreeBackground = dynamic(() => import("../components/dashboard/ThreeBackground"), {
  ssr: false,
  loading: () => <div className="pointer-events-none fixed inset-0 -z-10" />
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head />
      <body>
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="dark">
          {/* 3D Background behind everything */}
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>

          {/* Dashboard UI */}
          <div className="min-h-screen">
            <DashboardShell>{children}</DashboardShell>
          </div>

          {/* Global toasts */}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
