"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import AnimatedNumber from "../ui/AnimatedNumber";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import clsx from "clsx";
import { formatCurrency } from "../../lib/utils";
import type { StatItem } from "../../types/dashboard";

type Props = {
  loading: boolean;
  stats?: StatItem[];
};

export default function StatsGrid({ loading, stats }: Props) {
  const defaults: StatItem[] = [
    { id: "revenue", label: "Revenue", value: 45231.89, change: 20.1, spark: [10, 20, 18, 35, 28, 40] },
    { id: "users", label: "Users", value: 2345, change: 15.3, spark: [5, 12, 9, 15, 24, 30] },
    { id: "orders", label: "Orders", value: 1234, change: -5.2, spark: [20, 18, 25, 22, 18, 16] },
    { id: "conversion", label: "Conversion", value: 3.24, change: 2.1, spark: [1.2, 1.5, 2.1, 1.9, 3.2, 3.1] }
  ];

  const items = stats ?? defaults;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s) => (
        <GlassCard key={s.id} className="p-4 hover:-translate-y-2 transition-transform">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ff2d95] flex items-center justify-center text-white">
                {/* Icon placeholder */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H9L12 2Z" fill="white"/></svg>
              </div>
              <div>
                <div className="text-xs text-white/70">{s.label}</div>
                <div className="text-xl font-semibold">
                  <AnimatedNumber value={s.value} duration={2} format={(v) => (s.id === "revenue" ? formatCurrency(Number(v)) : String(v))} />
                </div>
              </div>
            </div>

            <div className={clsx("text-sm font-medium px-2 py-1 rounded-md", s.change >= 0 ? "bg-green-900/40 text-green-300" : "bg-red-900/30 text-red-300")}>
              {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change)}%
            </div>
          </div>

          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.spark.map((v, i) => ({ x: i, y: v }))}>
                <Area type="monotone" dataKey="y" stroke="#fff" fill="url(#spark)" strokeWidth={2} />
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#7caedff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
