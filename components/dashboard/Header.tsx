"use client";

import React, { useEffect, useState } from "react";
import { Search, Microphone, Bell, Sun, Moon } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import clsx from "clsx";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Header({ collapsed }: Props) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl glass border-b border-white/6">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-white/80">Dashboard</div>

          <div className="relative">
            <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 gap-2 w-[360px] md:w-[420px] transition-transform duration-200">
              <Search size={16} />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none placeholder:text-white/60 w-full text-sm"
              />
            </div>
            <button className="absolute right-2 top-2 p-1 rounded-md hover:bg-white/3 transition-all">
              <Microphone size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 rounded-md hover:bg-white/5">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-xs">3</span>
            </button>
          </div>

          <ThemeToggle />

          <div className="flex items-center gap-3">
            <div className="text-sm text-white/70">{format(now, "HH:mm:ss")}</div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ff2d95] flex items-center justify-center">QA</div>
          </div>
        </div>
      </div>
    </header>
  );
}
