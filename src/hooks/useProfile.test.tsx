import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@/test/utils";
import { useProfile } from "./useProfile";

vi.mock("@gaqno-development/frontcore/hooks/auth/useSsoAuth", () => ({
  useMe: () => ({
    data: { user: { firstName: "A", lastName: "B" } },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    enabled: true,
  }),
}));

vi.mock("@gaqno-development/frontcore/utils/api/sso-client", () => ({
  ssoAxiosClient: { patch: vi.fn().mockResolvedValue({ data: {} }) },
}));

describe("useProfile", () => {
  it("returns user, session, isLoading, updateProfile", () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.user).toBeDefined();
    expect(typeof result.current.updateProfile).toBe("function");
  });
});
