"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import clsx from "clsx";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={clsx("overflow-auto", "p-4 md:p-6 lg:p-8")}>{children}</div>
      </div>
    </div>
  );
}
