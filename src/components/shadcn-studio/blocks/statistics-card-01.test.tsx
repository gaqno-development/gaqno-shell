import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import StatisticsCard from "./statistics-card-01";

describe("StatisticsCard", () => {
  it("renders statistics card", () => {
    render(
      <StatisticsCard
        icon={<span>Icon</span>}
        value="100"
        title="Sales"
        changePercentage="+10%"
      />
    );
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("+10%")).toBeInTheDocument();
    expect(screen.getByText("than last week")).toBeInTheDocument();
  });
});
