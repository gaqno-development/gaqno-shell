import type React from "react";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";

export const TIME_RANGES = ["7d", "30d", "90d", "12m"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export type TrendDirection = "up" | "down";

export type ActivityType = "deploy" | "alert" | "scale" | "security";

export type ActivityStatus = "success" | "warning" | "info";

export interface ChartDataPoint {
  month: string;
  apiCalls: number;
  storage: number;
  bandwidth: number;
}

export interface OverviewCardData {
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: React.ElementType;
  description: string;
}

export interface ActivityItemData {
  id: string;
  type: ActivityType;
  service: string;
  message: string;
  timestamp: string;
  status: ActivityStatus;
}

export interface DashboardOverviewState {
  timeRange: TimeRange;
  chartData: readonly ChartDataPoint[];
  chartConfig: ChartConfig;
  overviewCards: readonly OverviewCardData[];
  activityItems: readonly ActivityItemData[];
  timeRangeLabels: Record<TimeRange, string>;
  handleTimeRangeChange: (range: TimeRange) => void;
}
