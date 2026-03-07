import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import ProductInsightsCard from "./widget-product-insights";

describe("ProductInsightsCard", () => {
  it("renders product insight card", () => {
    render(<ProductInsightsCard />);
    expect(screen.getByText("Product insight")).toBeInTheDocument();
    expect(screen.getByText("21,153")).toBeInTheDocument();
    expect(screen.getByText("2,123")).toBeInTheDocument();
  });
});
