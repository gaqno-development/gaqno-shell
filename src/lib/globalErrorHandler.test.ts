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

  it("shows fallback when non-ignored error is dispatched", () => {
    installGlobalErrorHandler();
    const err = new Error("Something broke");
    window.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(document.getElementById("gaqno-global-error")).not.toBeNull();
    expect(document.getElementById("gaqno-global-error")?.textContent).toContain(
      "Algo deu errado"
    );
  });

  it("handles unhandledrejection and shows fallback", () => {
    installGlobalErrorHandler();
    const event = new Event("unhandledrejection") as Event & {
      reason: unknown;
      promise: Promise<unknown>;
    };
    event.reason = new Error("Promise failed");
    event.promise = Promise.resolve();
    window.dispatchEvent(event);
    expect(document.getElementById("gaqno-global-error")).not.toBeNull();
  });

  it("uses string message when error event has message only", () => {
    installGlobalErrorHandler();
    window.dispatchEvent(new ErrorEvent("error", { message: "plain string" }));
    const el = document.getElementById("gaqno-global-error");
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain("Algo deu errado");
  });

  it("handles non-Error reason in unhandledrejection", () => {
    installGlobalErrorHandler();
    const ev = new Event("unhandledrejection") as Event & {
      reason: unknown;
      promise: Promise<unknown>;
    };
    ev.reason = { code: 500, detail: "Server error" };
    ev.promise = Promise.resolve();
    window.dispatchEvent(ev);
    expect(document.getElementById("gaqno-global-error")).not.toBeNull();
  });

  it("does not show overlay when root is missing", () => {
    const root = document.getElementById("root");
    root?.remove();
    installGlobalErrorHandler();
    window.dispatchEvent(new ErrorEvent("error", { error: new Error("x") }));
    expect(document.getElementById("gaqno-global-error")).toBeNull();
    if (root) document.body.appendChild(root);
  });
});
