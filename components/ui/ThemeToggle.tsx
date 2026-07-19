"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-white/5 transition-all"
      aria-label="Toggle theme"
    >
      <motion.div animate={{ rotate: theme === "dark" ? 0 : 180 }} transition={{ duration: 0.4 }}>
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
    </button>
  );
}
