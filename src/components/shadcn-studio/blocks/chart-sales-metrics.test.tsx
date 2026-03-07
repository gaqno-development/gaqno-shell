import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import SalesMetricsCard from "./chart-sales-metrics";

describe("SalesMetricsCard", () => {
  it("renders sales metrics", () => {
    render(<SalesMetricsCard />);
    expect(screen.getByText("Sales metrics")).toBeInTheDocument();
    expect(screen.getByText("Revenue goal")).toBeInTheDocument();
  });
});
