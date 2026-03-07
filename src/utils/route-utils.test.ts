import { describe, it, expect } from "vitest";
import { getFirstAvailableRoute } from "./route-utils";

describe("getFirstAvailableRoute", () => {
  it("returns /dashboard when permissions include platform.all", () => {
    expect(getFirstAvailableRoute(["platform.all"])).toBe("/dashboard");
  });

  it("returns first route with no required permissions", () => {
    expect(getFirstAvailableRoute([])).toBe("/dashboard");
  });

  it("returns route when user has all required permissions", () => {
    expect(getFirstAvailableRoute(["crm.access"])).toBe("/dashboard");
  });

  it("returns first route when no specific permission matches", () => {
    expect(getFirstAvailableRoute(["nonexistent.permission"])).toBe("/dashboard");
  });

  it("returns first available route for erp access", () => {
    expect(getFirstAvailableRoute(["erp.access"])).toBe("/dashboard");
  });
});
