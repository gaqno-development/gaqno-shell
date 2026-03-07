import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
