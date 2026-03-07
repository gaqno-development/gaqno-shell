import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OverviewCard } from "./OverviewCard";
import { Activity } from "lucide-react";

describe("OverviewCard", () => {
  it("renders title and value", () => {
    render(
      <OverviewCard
        title="Test"
        value="100"
        change="+10%"
        trend="up"
        icon={Activity}
        description="Desc"
      />
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("+10%")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("renders without description", () => {
    render(
      <OverviewCard
        title="T"
        value="0"
        change="-5%"
        trend="down"
        icon={Activity}
        description=""
      />
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByText("Desc")).not.toBeInTheDocument();
  });
});
