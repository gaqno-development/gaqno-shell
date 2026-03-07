import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProfileForm } from "./useProfileForm";

vi.mock("./useProfile", () => ({
  useProfile: () => ({
    user: { firstName: "A", lastName: "B", phone: "", avatar: "" },
    isLoading: false,
    error: null,
    updateProfile: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("useProfileForm", () => {
  it("returns form state and handleSubmitProfile", () => {
    const { result } = renderHook(() => useProfileForm());
    expect(result.current.firstName).toBe("A");
    expect(result.current.lastName).toBe("B");
    expect(typeof result.current.handleSubmitProfile).toBe("function");
  });
});
