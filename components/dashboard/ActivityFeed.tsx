"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { motion } from "framer-motion";

type Activity = {
  id: string;
  type: "sale" | "new_user" | "order" | "alert";
  text: string;
  time: Date;
};

const icons: Record<Activity["type"], string> = {
  sale: "🟢",
  new_user: "🟣",
  order: "🟠",
  alert: "🔴"
};

export default function ActivityFeed() {
  const [items, setItems] = useState<Activity[]>(() => {
    const now = new Date();
    return [
      { id: "1", type: "sale", text: "New sale: Order #9841", time: new Date(+now - 1000 * 60 * 5) },
      { id: "2", type: "new_user", text: "New user: Linh joined", time: new Date(+now - 1000 * 60 * 12) },
      { id: "3", type: "order", text: "Order #9839 is processing", time: new Date(+now - 1000 * 60 * 30) }
    ];
  });

  useEffect(() => {
    const t = setInterval(() => {
      const id = Math.random().toString(36).slice(2, 9);
      const types: Activity["type"][] = ["sale", "new_user", "order", "alert"];
      const type = types[Math.floor(Math.random() * types.length)];
      setItems((s) => [{ id, type, text: `${type === "sale" ? "New sale" : type === "new_user" ? "New user" : type === "order" ? "Order update" : "Alert"} ${id.slice(0, 4)}`, time: new Date() }, ...s].slice(0, 50));
    }, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm text-white/70">Activity</div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7c3aed] to-[#ff2d95] opacity-60" />
        <div className="space-y-3">
          {items.map((it, idx) => (
            <motion.div key={it.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-sm">{icons[it.type]}</div>
              <div>
                <div className="text-sm">{it.text}</div>
                <div className="text-xs text-white/60">{formatDistanceToNowStrict(it.time)} ago</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="px-3 py-1 rounded-md bg-white/5">Load more</button>
      </div>
    </div>
  );
}
