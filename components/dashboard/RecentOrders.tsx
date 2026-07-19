"use client";

import React from "react";
import type { Order } from "../../types/dashboard";
import { formatCurrency, relativeTime } from "../../lib/utils";
import { motion } from "framer-motion";

type Props = { loading: boolean; orders?: Order[] | null };

export default function RecentOrders({ loading, orders }: Props) {
  const list = orders ?? [];

  if (!loading && list.length === 0) {
    return <div className="text-center py-10 text-white/60">No recent orders</div>;
  }

  return (
    <div className="overflow-auto max-h-[380px]">
      <table className="w-full table-auto">
        <thead className="sticky top-0 bg-transparent backdrop-blur-md">
          <tr>
            <th className="text-left text-sm text-white/60 py-2">Order</th>
            <th className="text-left text-sm text-white/60 py-2">Customer</th>
            <th className="text-left text-sm text-white/60 py-2">Product</th>
            <th className="text-right text-sm text-white/60 py-2">Amount</th>
            <th className="text-right text-sm text-white/60 py-2">Status</th>
            <th className="text-right text-sm text-white/60 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o, i) => (
            <motion.tr key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <td className="py-3 text-sm">{o.id}</td>
              <td className="py-3 text-sm flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: o.avatarBg }}>
                  {o.customer.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-xs text-white/60">{o.email}</div>
                </div>
              </td>
              <td className="py-3 text-sm">{o.product}</td>
              <td className="py-3 text-right text-sm">{formatCurrency(o.amount)}</td>
              <td className="py-3 text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${o.status === "Completed" ? "bg-green-900/40 text-green-300" : o.status === "Pending" ? "bg-yellow-900/40 text-yellow-300" : o.status === "Cancelled" ? "bg-red-900/40 text-red-300" : "bg-purple-900/40 text-purple-300"}`}>
                  {o.status}
                </span>
              </td>
              <td className="py-3 text-right text-sm">{relativeTime(o.date)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
