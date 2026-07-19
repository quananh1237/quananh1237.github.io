"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { formatCurrency } from "../../lib/utils";
import type { Product } from "../../types/dashboard";

type Props = { loading: boolean; products?: Product[] | null };

export default function TopProducts({ loading, products }: Props) {
  const data = products ?? [
    { name: "Product A", revenue: 12000, share: 32 },
    { name: "Product B", revenue: 9000, share: 24 },
    { name: "Product C", revenue: 7000, share: 18 },
    { name: "Product D", revenue: 6000, share: 15 },
    { name: "Product E", revenue: 3000, share: 11 }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Top Products</h4>
        <a className="text-sm text-white/70 hover:underline">View All →</a>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer>
          <BarChart layout="vertical" data={data} margin={{ left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" axisLine={false} tick={{ fill: "rgba(255,255,255,0.8)" }} width={120} />
            <Tooltip contentStyle={{ background: "rgba(255,255,255,0.04)", border: "none", color: "#fff" }} formatter={(v: any) => formatCurrency(v)} />
            <Bar dataKey="revenue" fill="url(#bar)" isAnimationActive animationDuration={800} radius={[8, 8, 8, 8]}>
              <defs>
                <linearGradient id="bar" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ff2d95" />
                </linearGradient>
              </defs>
              <LabelList dataKey="share" position="right" formatter={(v: number) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
