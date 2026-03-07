import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@/test/utils";
import { useSettings } from "./useSettings";

vi.mock("@gaqno-development/frontcore/hooks/useAuth", () => ({
  useAuth: () => ({
    profile: { name: "Test" },
  }),
}));

describe("useSettings", () => {
  it("returns profile and loading", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.profile).toBeDefined();
    expect(typeof result.current.loading).toBe("boolean");
  });
});
