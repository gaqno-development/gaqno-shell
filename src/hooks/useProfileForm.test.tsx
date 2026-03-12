import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfileForm } from "./useProfileForm";

const mockUpdateProfile = vi.fn();

vi.mock("./useProfile", () => ({
  useProfile: () => ({
    user: { firstName: "A", lastName: "B", phone: "", avatar: "" },
    isLoading: false,
    error: null,
    updateProfile: mockUpdateProfile,
  }),
}));

describe("useProfileForm", () => {
  beforeEach(() => {
    mockUpdateProfile.mockReset();
    mockUpdateProfile.mockResolvedValue(undefined);
  });

  it("returns form state and handleSubmitProfile", () => {
    const { result } = renderHook(() => useProfileForm());
    expect(result.current.firstName).toBe("A");
    expect(result.current.lastName).toBe("B");
    expect(typeof result.current.handleSubmitProfile).toBe("function");
  });

  it("sets success message when updateProfile resolves", async () => {
    mockUpdateProfile.mockResolvedValue(undefined);
    const { result } = renderHook(() => useProfileForm());
    await act(async () => {
      result.current.handleSubmitProfile({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.message).toEqual({
      type: "success",
      text: "Perfil atualizado.",
    });
  });

  it("sets error message when updateProfile rejects", async () => {
    mockUpdateProfile.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useProfileForm());
    await act(async () => {
      result.current.handleSubmitProfile({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });
    expect(result.current.message).toEqual({
      type: "error",
      text: "Não foi possível atualizar o perfil.",
    });
  });
});
