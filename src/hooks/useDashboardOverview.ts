import { useState, useMemo } from "react";
import { Zap, HardDrive, Wifi, Globe } from "lucide-react";
import type { ChartConfig } from "@gaqno-development/frontcore/components/ui";
import {
  TIME_RANGES,
  type TimeRange,
  type ChartDataPoint,
  type OverviewCardData,
  type ActivityItemData,
  type DashboardOverviewState,
} from "../types/dashboard-overview.types";

const CHART_DATA: readonly ChartDataPoint[] = [
  { month: "Jan", apiCalls: 4200, storage: 2400, bandwidth: 1800 },
  { month: "Feb", apiCalls: 4800, storage: 2600, bandwidth: 2200 },
  { month: "Mar", apiCalls: 5100, storage: 2900, bandwidth: 2600 },
  { month: "Apr", apiCalls: 4600, storage: 3100, bandwidth: 2400 },
  { month: "May", apiCalls: 5800, storage: 3400, bandwidth: 3100 },
  { month: "Jun", apiCalls: 6200, storage: 3600, bandwidth: 3400 },
  { month: "Jul", apiCalls: 7100, storage: 3800, bandwidth: 3800 },
  { month: "Aug", apiCalls: 6800, storage: 4100, bandwidth: 4200 },
  { month: "Sep", apiCalls: 7400, storage: 4300, bandwidth: 4600 },
  { month: "Oct", apiCalls: 8200, storage: 4600, bandwidth: 5100 },
  { month: "Nov", apiCalls: 8800, storage: 4900, bandwidth: 5400 },
  { month: "Dec", apiCalls: 9400, storage: 5200, bandwidth: 5800 },
];

const CHART_CONFIG: ChartConfig = {
  apiCalls: { label: "API Calls", color: "hsl(217 91% 60%)" },
  storage: { label: "Storage (GB)", color: "hsl(160 84% 39%)" },
  bandwidth: { label: "Bandwidth (GB)", color: "hsl(280 68% 60%)" },
};

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
};

const OVERVIEW_CARDS: readonly OverviewCardData[] = [
  { title: "API Calls", value: "9.4K", change: "+12.5%", trend: "up", icon: Zap, description: "This month" },
  { title: "Storage Used", value: "5.2 TB", change: "+6.1%", trend: "up", icon: HardDrive, description: "Total consumed" },
  { title: "Bandwidth", value: "5.8 TB", change: "+7.4%", trend: "up", icon: Wifi, description: "Data transferred" },
  { title: "Active Services", value: "12", change: "-1", trend: "down", icon: Globe, description: "Running now" },
];

const ACTIVITY_ITEMS: readonly ActivityItemData[] = [
  { id: "1", type: "deploy", service: "API Gateway", message: "Deployment completed successfully", timestamp: "2 min ago", status: "success" },
  { id: "2", type: "alert", service: "Auth Service", message: "High latency detected (p99 > 500ms)", timestamp: "15 min ago", status: "warning" },
  { id: "3", type: "scale", service: "Worker Pool", message: "Auto-scaled from 3 to 5 instances", timestamp: "42 min ago", status: "info" },
  { id: "4", type: "deploy", service: "CDN Edge", message: "Cache invalidation completed", timestamp: "1 hr ago", status: "success" },
  { id: "5", type: "security", service: "Firewall", message: "Blocked 1,247 suspicious requests", timestamp: "2 hr ago", status: "info" },
  { id: "6", type: "deploy", service: "Database Cluster", message: "Primary failover test passed", timestamp: "3 hr ago", status: "success" },
];

const buildChartDataByRange = (range: TimeRange): readonly ChartDataPoint[] => {
  const sliceMap: Record<TimeRange, number> = {
    "7d": 1,
    "30d": 3,
    "90d": 6,
    "12m": 12,
  };
  return CHART_DATA.slice(-sliceMap[range]);
};

export const useDashboardOverview = (): DashboardOverviewState => {
  const [timeRange, setTimeRange] = useState<TimeRange>("12m");

  const chartData = useMemo(
    () => buildChartDataByRange(timeRange),
    [timeRange]
  );

  return {
    timeRange,
    chartData,
    chartConfig: CHART_CONFIG,
    overviewCards: OVERVIEW_CARDS,
    activityItems: ACTIVITY_ITEMS,
    timeRangeLabels: TIME_RANGE_LABELS,
    handleTimeRangeChange: setTimeRange,
  };
};
