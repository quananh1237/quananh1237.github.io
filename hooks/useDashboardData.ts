"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData } from "../types/dashboard";
import { randomRange, formatISODate } from "../lib/utils";

export default function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1500));

      const stats = [
        { id: "revenue", label: "Revenue", value: randomRange(32000, 60231.89, true), change: 20.1, spark: Array.from({ length: 12 }, () => randomRange(5, 40)) },
        { id: "users", label: "Users", value: randomRange(1200, 4500, false), change: 15.3, spark: Array.from({ length: 12 }, () => randomRange(1, 50)) },
        { id: "orders", label: "Orders", value: randomRange(800, 1500, false), change: -5.2, spark: Array.from({ length: 12 }, () => randomRange(10, 30)) },
        { id: "conversion", label: "Conversion", value: parseFloat((randomRange(1, 5, true)).toFixed(2)), change: 2.1, spark: Array.from({ length: 12 }, () => randomRange(0.5, 4, true)) }
      ];

      const chart = Array.from({ length: 12 }).map((_, i) => ({
        month: `M${i + 1}`,
        value: randomRange(30000, 60000, true)
      }));

      const products = [
        { name: "Aurora Pro", revenue: randomRange(8000, 15000, true), share: 32 },
        { name: "Nebula X", revenue: randomRange(5000, 12000, true), share: 24 },
        { name: "Lumen Mini", revenue: randomRange(3000, 9000, true), share: 18 },
        { name: "Orbit Plus", revenue: randomRange(2000, 7000, true), share: 15 },
        { name: "Pulse Lite", revenue: randomRange(1000, 4000, true), share: 11 }
      ];

      const orders = Array.from({ length: 10 }).map((_, i) => {
        const id = `#${Math.floor(Math.random() * 9000 + 1000)}`;
        const customer = ["Anh", "Linh", "Nam", "Huy", "Trang", "Mai"][i % 6] + " " + ["Nguyen", "Le", "Tran", "Pham"][i % 4];
        const avatarBg = `linear-gradient(135deg, hsl(${(i * 45) % 360} 70% 60%), hsl(${(i * 60 + 150) % 360} 60% 55%))`;
        return {
          id,
          customer,
          email: `${customer.split(" ")[0].toLowerCase()}@example.com`,
          product: products[i % products.length].name,
          amount: randomRange(30, 15000, true),
          status: ["Completed", "Pending", "Cancelled", "Processing"][i % 4] as any,
          date: formatISODate(new Date(Date.now() - i * 3600 * 1000)),
          avatarBg
        };
      });

      setData({ stats, chart, products, orders });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => {
      fetchData(); // silent update
    }, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
