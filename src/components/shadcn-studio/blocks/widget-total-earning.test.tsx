import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import TotalEarningCard from "./widget-total-earning";

const earningData = [
  {
    img: "https://example.com/1.png",
    platform: "Platform",
    technologies: "Tech",
    earnings: "$100",
    progressPercentage: 50,
  },
];

describe("TotalEarningCard", () => {
  it("renders card with title and earning", () => {
    render(
      <TotalEarningCard
        title="Earnings"
        earning={1000}
        trend="up"
        percentage={10}
        comparisonText="vs last month"
        earningData={earningData}
      />
    );
    expect(screen.getByText("Earnings")).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
  });
});
