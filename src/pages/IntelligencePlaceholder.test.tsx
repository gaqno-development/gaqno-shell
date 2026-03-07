import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import IntelligencePlaceholder from "./IntelligencePlaceholder";

describe("IntelligencePlaceholder", () => {
  it("renders placeholder content", () => {
    render(<IntelligencePlaceholder />);
    expect(screen.getByText(/Inteligência|menu\.intelligence/i)).toBeInTheDocument();
  });
});
