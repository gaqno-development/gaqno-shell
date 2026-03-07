import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUserDashboard } from "./useUserDashboard";

describe("useUserDashboard", () => {
  it("returns loading and data structure", () => {
    const { result } = renderHook(() => useUserDashboard());
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      completedTasks: 0,
      pendingTasks: 0,
      documents: 0,
      performance: "--",
    });
  });
});
