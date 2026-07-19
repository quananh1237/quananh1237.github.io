"use client";

import React from "react";
import { Home, BarChart2, ShoppingCart, Users, Settings, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

const menu = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ collapsed, setCollapsed }: Props) {
  return (
    <aside
      className={clsx(
        "relative z-20 h-full transition-all duration-500",
        "glass border border-white/10",
        collapsed ? "w-18 md:w-18" : "w-72",
        "flex flex-col"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div
            aria-hidden
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-gradientFrom to-gradientTo text-white cursor-pointer transform transition-transform duration-500 hover:rotate-360"
            onMouseEnter={() => {}}
          >
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8H9L12 2Z" fill="white" />
              </svg>
            </motion.div>
          </div>

          {!collapsed && <div className="text-sm font-semibold">Modern SaaS</div>}
        </div>

        <button
          aria-label="Collapse sidebar"
          className="p-2 rounded-md hover:bg-white/5 transition-all"
          onClick={() => setCollapsed(!collapsed)}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <ChevronLeft size={18} />
          </motion.div>
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        {menu.map((m) => {
          const Icon = m.icon;
          const active = m.id === "dashboard";
          return (
            <motion.a
              key={m.id}
              whileHover={{ scale: 1.02, x: 4 }}
              className={clsx(
                "group flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-all",
                active ? "bg-gradient-to-r from-[#7c3aed]/30 to-[#ff2d95]/20" : "hover:bg-white/5"
              )}
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-md bg-white/6">
                <Icon size={18} />
              </div>

              <div className="flex-1">
                {!collapsed ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{m.label}</span>
                    {m.id === "orders" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-600">
                        3
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse-ring" />
                      </span>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Active indicator */}
              <AnimatePresence>{active && <motion.span layoutId="indicator" className="absolute left-0 w-1 h-10 rounded-r-full bg-gradient-to-b from-[#7c3aed] to-[#ff2d95]" />}</AnimatePresence>
            </motion.a>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="border-t border-white/5 pt-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ff2d95] flex items-center justify-center text-white">QA</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 ring-2 ring-white animate-pulse" />
          </div>
          <div className="flex-1">
            {!collapsed ? (
              <>
                <div className="text-sm font-medium">Quán Anh</div>
                <div className="text-xs text-white/60">Admin</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
