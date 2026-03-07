import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useDashboardWidgets,
  useDashboardData,
  useDashboardPreferences,
  useSaveDashboardPreferences,
} from "./useDashboard";

const mockGet = vi.fn();
const mockPut = vi.fn();
vi.mock("@gaqno-development/frontcore/utils/api", () => ({
  ssoClient: {
    get: (...args: unknown[]) => mockGet(...args),
    put: (...args: unknown[]) => mockPut(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useDashboardWidgets fetches widgets", async () => {
    mockGet.mockResolvedValue({ data: { widgets: [] } });
    const { result } = renderHook(() => useDashboardWidgets(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/dashboard/widgets");
    expect(result.current.data).toEqual({ widgets: [] });
  });

  it("useDashboardData fetches summary", async () => {
    mockGet.mockResolvedValue({ data: { summary: {} } });
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGet).toHaveBeenCalledWith("/dashboard/summary", expect.any(Object));
    expect(result.current.data).toEqual({ summary: {} });
  });

  it("useDashboardPreferences returns default when empty", async () => {
    mockGet.mockResolvedValue({ data: null });
    const { result } = renderHook(() => useDashboardPreferences(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ widgets: [], layout: {} });
  });

  it("useSaveDashboardPreferences saves and invalidates", async () => {
    mockPut.mockResolvedValue({ data: { widgets: [], layout: {} } });
    const { result } = renderHook(() => useSaveDashboardPreferences(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ widgets: [], layout: {} });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPut).toHaveBeenCalledWith("/dashboard/preferences", {
      widgets: [],
      layout: {},
    });
  });
});
