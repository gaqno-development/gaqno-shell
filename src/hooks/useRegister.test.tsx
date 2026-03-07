import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRegister } from "./useRegister";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("useRegister", () => {
  it("returns form, onSubmit, isSubmitting, error", () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.form).toBeDefined();
    expect(typeof result.current.onSubmit).toBe("function");
    expect(typeof result.current.isSubmitting).toBe("boolean");
    expect(result.current.error).toBeUndefined();
  });
});
