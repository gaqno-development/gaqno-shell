import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useMicroFrontendLoader } from "./useMicroFrontendLoader";

vi.mock("@/lib/patchFederationRemotes", () => ({
  ensureFederationRemotesPatched: vi.fn(),
  REMOTE_PATHS: { nonexistent: "/nonexistent" },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe("useMicroFrontendLoader", () => {
  it("exports hook that is a function", () => {
    expect(typeof useMicroFrontendLoader).toBe("function");
  });

  it.skip("returns Component and error state", async () => {
    const { result } = renderHook(
      () => useMicroFrontendLoader({ remoteName: "nonexistent", moduleName: "App" }),
      { wrapper }
    );
    await waitFor(() => {
      expect(result.current).toHaveProperty("Component");
      expect(result.current).toHaveProperty("error");
    });
    expect(typeof result.current.Component === "function" || result.current.Component === null).toBe(true);
    expect(typeof result.current.error === "string" || result.current.error === null).toBe(true);
  });
});
