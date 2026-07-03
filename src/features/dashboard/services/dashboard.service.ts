/**
 * Dashboard Service
 *
 * Abhi mock data return karta hai.
 * Jab backend APIs ready hon, sirf is file mein
 * httpClient calls add karo — baaki kuch nahi badlega.
 */

import type { DashboardData } from "../types/dashboard.types";

// ── Mock data — replace with real API calls later ─────────────────────────────
const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: [
    {
      id: "photos",
      label: "Total Photos",
      value: 248,
      change: 12,
      changeLabel: "vs last month",
      icon: "photos",
      color: "blue",
    },
    {
      id: "videos",
      label: "Total Videos",
      value: 34,
      change: 5,
      changeLabel: "vs last month",
      icon: "videos",
      color: "violet",
    },
    {
      id: "logos",
      label: "Total Logos",
      value: 18,
      change: -2,
      changeLabel: "vs last month",
      icon: "logos",
      color: "emerald",
    },
    {
      id: "total",
      label: "Total Assets",
      value: 300,
      change: 8,
      changeLabel: "vs last month",
      icon: "total",
      color: "amber",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "photo",
      action: "uploaded",
      title: "Portfolio Hero Shot",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "2",
      type: "video",
      action: "uploaded",
      title: "Brand Introduction Reel",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "3",
      type: "logo",
      action: "updated",
      title: "Main Brand Logo SVG",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "4",
      type: "photo",
      action: "deleted",
      title: "Old Banner Image",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "5",
      type: "video",
      action: "uploaded",
      title: "Product Showcase Video",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
  ],
  totalStorage: 5120,   // 5 GB
  usedStorage: 1843,    // ~1.8 GB
};

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    // Simulate network delay in development
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // TODO: Replace with real API call
    // const response = await httpClient.get<ApiResponse<DashboardData>>(
    //   ENDPOINTS.DASHBOARD.STATS
    // );
    // return response.data.data;

    return MOCK_DASHBOARD_DATA;
  },
};