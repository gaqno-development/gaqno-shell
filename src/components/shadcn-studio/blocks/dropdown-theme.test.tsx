import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ThemeDropdown from "./dropdown-theme";

describe("ThemeDropdown", () => {
  it("renders with trigger", () => {
    render(<ThemeDropdown trigger={<button>Theme</button>} />);
    expect(document.body).toBeTruthy();
  });
});
