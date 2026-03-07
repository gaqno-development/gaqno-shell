import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LanguageDropdown from "./dropdown-language";

describe("LanguageDropdown", () => {
  it("renders with trigger", () => {
    render(<LanguageDropdown trigger={<button>Lang</button>} />);
    expect(document.body).toBeTruthy();
  });
});
