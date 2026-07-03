"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { queryKeys } from "@/lib/query/query.keys";

export const useDashboard = () => {
  const query = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 2 * 60 * 1000,   // 2 min — dashboard data thoda zyada fresh chahiye
  });

  return {
    data: query.data,
    stats: query.data?.stats ?? [],
    recentActivity: query.data?.recentActivity ?? [],
    totalStorage: query.data?.totalStorage ?? 0,
    usedStorage: query.data?.usedStorage ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};