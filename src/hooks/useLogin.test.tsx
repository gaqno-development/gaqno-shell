import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useSignIn } from "@gaqno-development/frontcore/hooks/auth/useSsoAuth";
import { authStorage } from "@/utils/auth-storage";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

vi.mock("@gaqno-development/frontcore/hooks/auth/useSsoAuth", () => ({
  useSignIn: vi.fn(),
}));

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSignIn).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as ReturnType<typeof useSignIn>);
  });

  it("returns form, onSubmit, isSubmitting, and error", () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.form).toBeDefined();
    expect(result.current.onSubmit).toBeDefined();
    expect(typeof result.current.isSubmitting).toBe("boolean");
    expect(result.current.error).toBeUndefined();
  });

  it("has default empty email and password", () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.form.getValues("email")).toBe("");
    expect(result.current.form.getValues("password")).toBe("");
  });

  it("onSuccess sets authStorage and navigates to dashboard", async () => {
    let mutateCallback: { onSuccess?: (data: unknown) => void } = {};
    const mutate = vi.fn((_vars: unknown, opts: { onSuccess?: (data: unknown) => void }) => {
      mutateCallback = opts ?? {};
    });
    vi.mocked(useSignIn).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useSignIn>);

    const setSpy = vi.spyOn(authStorage, "set").mockImplementation(() => {});

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.form.setValue("email", "user@example.com");
      result.current.form.setValue("password", "password123");
    });
    await act(async () => {
      result.current.onSubmit();
    });

    expect(mutate).toHaveBeenCalled();
    const data = {
      user: { id: "1", email: "user@example.com" },
      tokens: { accessToken: "tok", expiresAt: 123 },
    };
    mutateCallback.onSuccess?.(data);
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
    vi.mocked(useSignIn).mockReturnValue({
      mutate,
      isPending: false,
    } as ReturnType<typeof useSignIn>);

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(async () => {
      result.current.form.setValue("email", "user@example.com");
      result.current.form.setValue("password", "password123");
    });
    await act(async () => {
      result.current.onSubmit();
    });

    await act(async () => {
      mutateCallback.onError?.(new Error("Invalid credentials"));
    });
    expect(result.current.error).toBe("Invalid credentials");
  });
});
