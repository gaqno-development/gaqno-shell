import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHomeRedirect } from "./useHomeRedirect";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/utils/auth-storage", () => ({
  authStorage: {
    get: vi.fn().mockReturnValue({
      user: { id: "1" },
      session: { access_token: "token" },
    }),
  },
}));

describe("useHomeRedirect", () => {
  it("returns isRedirecting", () => {
    const { result } = renderHook(() => useHomeRedirect(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    expect(typeof result.current.isRedirecting).toBe("boolean");
  });
});
