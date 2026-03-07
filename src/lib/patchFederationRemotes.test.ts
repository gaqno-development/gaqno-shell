import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  REMOTE_PATHS,
  ensureFederationRemotesPatched,
} from "./patchFederationRemotes";

describe("patchFederationRemotes", () => {
  beforeEach(() => {
    delete (window as unknown as { __FEDERATION__?: unknown }).__FEDERATION__;
  });

  it("REMOTE_PATHS contains expected keys", () => {
    expect(REMOTE_PATHS).toHaveProperty("ai", "/ai");
    expect(REMOTE_PATHS).toHaveProperty("crm", "/crm");
    expect(REMOTE_PATHS).toHaveProperty("erp", "/erp");
  });

  it("does nothing when origin is localhost", () => {
    Object.defineProperty(window, "location", {
      value: { origin: "http://localhost:3000", host: "localhost:3000" },
      writable: true,
    });
    (window as unknown as { __FEDERATION__?: Record<string, { entry?: string }> }).__FEDERATION__ = {
      ai: { entry: "http://localhost:3002/assets/remoteEntry.js" },
    };
    ensureFederationRemotesPatched();
    expect(
      (window as unknown as { __FEDERATION__?: Record<string, { entry?: string }> }).__FEDERATION__?.ai?.entry
    ).toContain("localhost");
  });

  it("patches entry when production and localhost in entry", () => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://portal.gaqno.com.br", host: "portal.gaqno.com.br" },
      writable: true,
    });
    (window as unknown as { __FEDERATION__?: Record<string, { entry?: string }> }).__FEDERATION__ = {
      ai: { entry: "http://localhost:3002/assets/remoteEntry.js" },
    };
    ensureFederationRemotesPatched();
    expect(
      (window as unknown as { __FEDERATION__?: Record<string, { entry?: string }> }).__FEDERATION__?.ai?.entry
    ).toBe("https://portal.gaqno.com.br/ai/assets/remoteEntry.js");
  });
});
