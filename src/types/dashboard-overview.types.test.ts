import { describe, it, expect } from "vitest";
import {
  TIME_RANGES,
  type OverviewCardData,
  type ActivityItemData,
  type ChartDataPoint,
} from "./dashboard-overview.types";

describe("dashboard-overview.types", () => {
  it("TIME_RANGES has expected values", () => {
    expect(TIME_RANGES).toEqual(["7d", "30d", "90d", "12m"]);
  });

  it("OverviewCardData has expected shape", () => {
    const card: OverviewCardData = {
      key: "k",
      title: "T",
      value: "1",
      change: "+1%",
      trend: "up",
      icon: () => null,
      description: "d",
    };
    expect(card.trend).toBe("up");
  });

  it("ActivityItemData has expected shape", () => {
    const item: ActivityItemData = {
      id: "1",
      type: "deploy",
      service: "s",
      message: "m",
      timestamp: "now",
      status: "success",
    };
    expect(item.id).toBe("1");
  });

  it("ChartDataPoint has expected shape", () => {
    const point: ChartDataPoint = {
      date: "2024-01-01",
      apiCalls: 10,
      storage: 5,
      bandwidth: 2,
    };
    expect(point.apiCalls).toBe(10);
  });
});
