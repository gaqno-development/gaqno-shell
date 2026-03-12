import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRegister } from "./useRegister";
import { useSignUp } from "@gaqno-development/frontcore/hooks/auth/useSsoAuth";
import { authStorage } from "@/utils/auth-storage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@gaqno-development/frontcore/hooks/auth/useSsoAuth", () => ({
  useSignUp: vi.fn(),
}));

describe("useRegister", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useSignUp).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as ReturnType<typeof useSignUp>);
  });

  it("returns form, onSubmit, isSubmitting, error", () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.form).toBeDefined();
    expect(typeof result.current.onSubmit).toBe("function");
    expect(typeof result.current.isSubmitting).toBe("boolean");
    expect(result.current.error).toBeUndefined();
  });

  it("calls signUp.mutate and onSuccess navigates and sets authStorage", async () => {
    let mutateCallback: { onSuccess?: (data: unknown) => void } = {};
    const mutate = vi.fn((_vars: unknown, opts: { onSuccess?: (data: unknown) => void }) => {
      mutateCallback = opts ?? {};
    });
    vi.mocked(useSignUp).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useSignUp>);

    const setSpy = vi.spyOn(authStorage, "set").mockImplementation(() => {});

    const { result } = renderHook(() => useRegister());
    await act(async () => {
      result.current.form.setValue("name", "Test User");
      result.current.form.setValue("email", "test@example.com");
      result.current.form.setValue("password", "Pass1word");
      result.current.form.setValue("confirmPassword", "Pass1word");
    });
    await act(async () => {
      result.current.onSubmit();
    });

    expect(mutate).toHaveBeenCalled();
    const data = {
      user: { id: "1", email: "test@example.com" },
      tokens: { accessToken: "tok", expiresAt: 123 },
    };
    mutateCallback.onSuccess?.(data);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(setSpy).toHaveBeenCalledWith(data.user, {
      access_token: "tok",
      expires_at: 123,
    });
    setSpy.mockRestore();
  });

  it("onError sets form root error", async () => {
    let mutateCallback: { onError?: (error: Error) => void } = {};
    const mutate = vi.fn((_vars: unknown, opts: { onError?: (error: Error) => void }) => {
      mutateCallback = opts ?? {};
    });
    vi.mocked(useSignUp).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useSignUp>);

    const { result } = renderHook(() => useRegister());
    await act(async () => {
      result.current.form.setValue("name", "Test User");
      result.current.form.setValue("email", "test@example.com");
      result.current.form.setValue("password", "Pass1word");
      result.current.form.setValue("confirmPassword", "Pass1word");
    });
    await act(async () => {
      result.current.onSubmit();
    });

    await act(async () => {
      mutateCallback.onError?.(new Error("Email already exists"));
    });
    expect(result.current.error).toBe("Email already exists");
  });
});
