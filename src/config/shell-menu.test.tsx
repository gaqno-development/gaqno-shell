import { describe, it, expect } from "vitest";
import { SHELL_MENU_ITEMS } from "./shell-menu";

describe("shell-menu", () => {
  it("exports SHELL_MENU_ITEMS array", () => {
    expect(Array.isArray(SHELL_MENU_ITEMS)).toBe(true);
    expect(SHELL_MENU_ITEMS.length).toBeGreaterThan(0);
  });

  it("each menu item has label and href", () => {
    SHELL_MENU_ITEMS.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");
      expect(item).toHaveProperty("href");
    });
  });
});
