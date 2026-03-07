import { describe, it, expect, beforeEach, vi } from "vitest";
import { installGlobalErrorHandler } from "./globalErrorHandler";

describe("globalErrorHandler", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "root";
    document.body.innerHTML = "";
    document.body.appendChild(root);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("installs without throwing", () => {
    expect(() => installGlobalErrorHandler()).not.toThrow();
  });

  it("ignores useAuth provider error", () => {
    installGlobalErrorHandler();
    const err = new Error("useAuth must be used within an AuthProvider");
    window.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(document.getElementById("gaqno-global-error")).toBeNull();
  });

  it("ignores React DevTools error", () => {
    installGlobalErrorHandler();
    const err = new Error("__REACT_DEVTOOLS_GLOBAL_HOOK__");
    window.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(document.getElementById("gaqno-global-error")).toBeNull();
  });
});
