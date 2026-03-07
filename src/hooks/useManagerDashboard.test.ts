import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useManagerDashboard } from "./useManagerDashboard";

describe("useManagerDashboard", () => {
  it("returns loading and data structure", () => {
    const { result } = renderHook(() => useManagerDashboard());
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      activeProjects: 0,
      teamMembers: 0,
      completedTasks: 0,
      pendingTasks: 0,
    });
  });
});
