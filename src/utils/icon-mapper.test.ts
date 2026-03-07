import { describe, it, expect, vi } from "vitest";

vi.mock("@gaqno-development/frontcore/utils", () => ({
  getIconComponent: vi.fn(() => () => null),
}));

import { getIconComponent } from "./icon-mapper";

describe("icon-mapper", () => {
  it("re-exports getIconComponent from frontcore", () => {
    expect(typeof getIconComponent).toBe("function");
  });
});
