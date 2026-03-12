import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStorage } from "./auth-storage";

describe("authStorage", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("gaqno_auth_state");
    } catch {
      if (typeof localStorage.clear === "function") localStorage.clear();
    }
  });

  it("get returns null when no stored state", () => {
    expect(authStorage.get()).toBeNull();
  });

  it("get returns null when window is undefined", () => {
    const win = global.window;
    Object.defineProperty(global, "window", { value: undefined });
    expect(authStorage.get()).toBeNull();
    Object.defineProperty(global, "window", { value: win });
  });

  it("set and get round-trip", () => {
    const user = { id: "1", email: "a@b.com", name: "Test" };
    const session = { access_token: "tok", expires_at: 123 };
    authStorage.set(user, session);
    const got = authStorage.get();
    expect(got?.user).toEqual(user);
    expect(got?.session).toEqual(session);
    expect(got?.timestamp).toBeDefined();
  });

  it("clear removes stored state", () => {
    authStorage.set({ id: "1", email: "x@y.com" }, { access_token: "t" });
    authStorage.clear();
    expect(authStorage.get()).toBeNull();
  });

  it("hasValidAuth returns true when user exists", () => {
    authStorage.set({ id: "1", email: "a@b.com" }, { access_token: "t" });
    expect(authStorage.hasValidAuth()).toBe(true);
  });

  it("hasValidAuth returns false when no state", () => {
    expect(authStorage.hasValidAuth()).toBe(false);
  });

  it("get returns null when state is expired", () => {
    const state = {
      user: { id: "1", email: "a@b.com" },
      session: { access_token: "t" },
      timestamp: Date.now() - 25 * 60 * 60 * 1000,
    };
    localStorage.setItem("gaqno_auth_state", JSON.stringify(state));
    expect(authStorage.get()).toBeNull();
  });

  it("get returns null on invalid JSON", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("gaqno_auth_state", "invalid");
    expect(authStorage.get()).toBeNull();
    spy.mockRestore();
  });

  it("set catches localStorage errors", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const setItemSpy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() =>
      authStorage.set({ id: "1", email: "a@b.com" }, { access_token: "t" })
    ).not.toThrow();
    expect(errSpy).toHaveBeenCalledWith("Error writing auth storage:", expect.any(Error));
    errSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  it("clear catches localStorage errors", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    authStorage.set({ id: "1" }, { access_token: "t" });
    const removeItemSpy = vi.spyOn(localStorage, "removeItem").mockImplementation(() => {
      throw new Error("Storage error");
    });
    expect(() => authStorage.clear()).not.toThrow();
    expect(errSpy).toHaveBeenCalledWith("Error clearing auth storage:", expect.any(Error));
    errSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
