import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useShellLayout } from "./useShellLayout";
import { MemoryRouter } from "react-router-dom";

describe("useShellLayout", () => {
  it("returns layout state", () => {
    const { result } = renderHook(() => useShellLayout(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/dashboard"]}>
          {children}
        </MemoryRouter>
      ),
    });
    expect(typeof result.current.shouldShowLayout).toBe("boolean");
    expect(typeof result.current.isMicroFrontend).toBe("boolean");
    expect(result.current.transitionKey).toBeDefined();
    expect(Array.isArray(result.current.menuItems)).toBe(true);
    expect(result.current.pageTransition).toBeDefined();
  });
});
