import { describe, it, expect } from "vitest";
import { MENU_ITEMS, ROUTE_PERMISSIONS } from "./menu-config";

describe("menu-config", () => {
  it("MENU_ITEMS has items", () => {
    expect(MENU_ITEMS.length).toBeGreaterThan(0);
    expect(MENU_ITEMS[0]).toHaveProperty("id");
    expect(MENU_ITEMS[0]).toHaveProperty("label");
    expect(MENU_ITEMS[0]).toHaveProperty("href");
    expect(MENU_ITEMS[0]).toHaveProperty("icon");
    expect(MENU_ITEMS[0]).toHaveProperty("requiredPermissions");
  });

  it("ROUTE_PERMISSIONS has entries", () => {
    expect(ROUTE_PERMISSIONS["/dashboard"]).toEqual([]);
    expect(ROUTE_PERMISSIONS["/pdv"]).toContain("pdv.access");
  });
});
