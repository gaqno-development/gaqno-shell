import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuthWithStorage";
import { authStorage } from "@/utils/auth-storage";

vi.mock("@gaqno-development/frontcore/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", email: "a@b.com" },
    signOut: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("@/utils/auth-storage", () => ({
  authStorage: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    hasValidAuth: vi.fn(),
  },
}));

describe("useAuthWithStorage", () => {
  it("returns auth with signOut that clears storage", async () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual({ id: "1", email: "a@b.com" });
    await result.current.signOut();
    expect(authStorage.clear).toHaveBeenCalled();
  });
});
