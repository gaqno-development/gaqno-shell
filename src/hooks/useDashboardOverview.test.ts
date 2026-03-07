import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardOverview } from "./useDashboardOverview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) =>
      opts?.count != null ? `${key}_${opts.count}` : key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

const mockGet = vi.fn();
vi.mock("@gaqno-development/frontcore/utils/api", () => ({
  ssoClient: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useDashboardOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockResolvedValue({
      data: {
        cards: [
          {
            key: "apiCalls",
            title: "API Calls",
            value: "100",
            change: "+5%",
            trend: "up",
            description: "Total",
          },
        ],
      },
    });
    mockGet.mockResolvedValueOnce({
      data: {
        cards: [
          {
            key: "apiCalls",
            title: "API Calls",
            value: "100",
            change: "+5%",
            trend: "up",
            description: "Total",
          },
        ],
      },
    });
    mockGet.mockResolvedValueOnce({
      data: { points: [{ x: "1", apiCalls: 10 }] },
    });
    mockGet.mockResolvedValueOnce({
      data: {
        events: [
          {
            id: "1",
            type: "deploy",
            service: "api",
            message: "Deployed",
            createdAt: new Date().toISOString(),
            status: "success",
          },
        ],
      },
    });
  });

  it("returns overview state with data", async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          cards: [{ key: "apiCalls", title: "API", value: "1", change: "+1", trend: "up", description: "" }],
        },
      })
      .mockResolvedValueOnce({ data: { points: [] } })
      .mockResolvedValueOnce({ data: { events: [] } });
    const { result } = renderHook(() => useDashboardOverview(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });
    expect(result.current).toHaveProperty("timeRange");
    expect(result.current).toHaveProperty("chartData");
    expect(result.current).toHaveProperty("overviewCards");
    expect(result.current).toHaveProperty("activityItems");
    expect(result.current).toHaveProperty("handleTimeRangeChange");
  });

  it("handleTimeRangeChange updates timeRange", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { cards: [] } })
      .mockResolvedValueOnce({ data: { points: [] } })
      .mockResolvedValueOnce({ data: { events: [] } });
    const { result } = renderHook(() => useDashboardOverview(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });
    expect(result.current.timeRange).toBe("30d");
    await act(async () => {
      result.current.handleTimeRangeChange("7d");
    });
    await waitFor(() => expect(result.current.timeRange).toBe("7d"));
  });
});
