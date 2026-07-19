"use client";

import React, { Suspense } from "react";
import StatsGrid from "../components/dashboard/StatsGrid";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import useDashboardData from "../hooks/useDashboardData";
import GlassCard from "../components/ui/GlassCard";

export default function Page() {
  const { data, loading } = useDashboardData();

  return (
    <main className="p-6 md:p-8 lg:p-10">
      <div className="space-y-6">
        <StatsGrid loading={loading} stats={data?.stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-4">
              <RevenueChart loading={loading} data={data?.chart} />
            </GlassCard>
            <GlassCard className="p-4">
              <RecentOrders loading={loading} orders={data?.orders} />
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-4">
              <TopProducts loading={loading} products={data?.products} />
            </GlassCard>

            <GlassCard className="p-4">
              <ActivityFeed />
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}
