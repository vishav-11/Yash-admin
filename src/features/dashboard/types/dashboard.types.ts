export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  change: number;          // percentage change (positive = up, negative = down)
  changeLabel: string;     // "vs last month"
  icon: StatIconName;
  color: StatColor;
}

export type StatIconName = "photos" | "videos" | "logos" | "total";
export type StatColor = "blue" | "violet" | "emerald" | "amber";

export interface RecentActivity {
  id: string;
  type: "photo" | "video" | "logo";
  action: "uploaded" | "deleted" | "updated";
  title: string;
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivity: RecentActivity[];
  totalStorage: number;     // in MB
  usedStorage: number;      // in MB
}