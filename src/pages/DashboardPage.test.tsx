import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import DashboardPage from "./DashboardPage";

const mockUseDashboardOverview = vi.fn();
vi.mock("../hooks/useDashboardOverview", () => ({
  useDashboardOverview: (...args: unknown[]) => mockUseDashboardOverview(...args),
}));

const defaultReturn = {
  timeRange: "30d" as const,
  chartData: [],
  chartConfig: {},
  overviewCards: [],
  activityItems: [],
  timeRangeLabels: { "7d": "7d", "30d": "30d", "90d": "90d", "12m": "12m" },
  isLoading: false,
  hasError: false,
  handleTimeRangeChange: vi.fn(),
};

describe("DashboardPage", () => {
  beforeEach(() => {
    mockUseDashboardOverview.mockReturnValue(defaultReturn);
  });

  it("renders dashboard", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard-main")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-welcome")).toBeInTheDocument();
  });

  it("shows loading when isLoading", () => {
    mockUseDashboardOverview.mockReturnValue({ ...defaultReturn, isLoading: true });
    render(<DashboardPage />);
    expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument();
  });
});
