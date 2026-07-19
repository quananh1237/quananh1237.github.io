"use client";

import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "../../lib/utils";
import clsx from "clsx";

type Props = { loading: boolean; data?: { month: string; value: number }[] | null };

export default function RevenueChart({ loading, data }: Props) {
  const [range, setRange] = useState<"month" | "year" | "week">("month");

  const d = useMemo(() => {
    if (data && data.length) return data;
    // generate 12 months
    return Array.from({ length: 12 }).map((_, i) => ({
      month: `M${i + 1}`,
      value: 30000 + Math.round(Math.random() * 30000)
    }));
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue</h3>
        <div className="flex items-center gap-2">
          {(["week", "month", "year"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx("px-3 py-1 rounded-md text-sm", range === r ? "bg-gradient-to-r from-[#7c3aed] to-[#ff2d95]" : "bg-white/3")}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={d}>
            <defs>
              <linearGradient id="colorRev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.6)" }} axisLine={false} />
            <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fill: "rgba(255,255,255,0.6)" }} axisLine={false} />

            <Tooltip
              contentStyle={{ background: "rgba(255,255,255,0.04)", border: "none", backdropFilter: "blur(6px)", color: "#fff" }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />

            <Area type="monotone" dataKey="value" stroke="#fff" strokeWidth={3} fill="url(#colorRev)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
