"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  hover?: boolean;
  padding?: string;
  children?: React.ReactNode;
};

export default function GlassCard({ className, hover = true, padding = "p-4", children }: Props) {
  return (
    <div
      className={clsx(
        "glass rounded-2xl border border-white/8",
        padding,
        hover ? "hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300" : "",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
    >
      {children}
    </div>
  );
}
