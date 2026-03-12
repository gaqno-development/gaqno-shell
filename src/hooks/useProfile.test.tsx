import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@/test/utils";
import { useProfile } from "./useProfile";

const mockRefetch = vi.fn().mockResolvedValue(undefined);
const mockPatch = vi.fn().mockResolvedValue({ data: { user: {} } });

vi.mock("@gaqno-development/frontcore/hooks/auth/useSsoAuth", () => ({
  useMe: () => ({
    data: { user: { firstName: "A", lastName: "B" } },
    isLoading: false,
    error: null,
    refetch: mockRefetch,
    enabled: true,
  }),
}));

vi.mock("@gaqno-development/frontcore/utils/api/sso-client", () => ({
  ssoAxiosClient: { patch: (...args: unknown[]) => mockPatch(...args) },
}));

describe("useProfile", () => {
  beforeEach(() => {
    mockRefetch.mockClear();
    mockPatch.mockResolvedValue({ data: { user: {} } });
  });

  it("returns user, session, isLoading, updateProfile", () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.user).toBeDefined();
    expect(typeof result.current.updateProfile).toBe("function");
  });

  it("updateProfile calls patch and refetch", async () => {
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfile({ firstName: "New", lastName: "Name" });
    });
    expect(mockPatch).toHaveBeenCalledWith("/me", { firstName: "New", lastName: "Name" });
    expect(mockRefetch).toHaveBeenCalled();
  });
});
