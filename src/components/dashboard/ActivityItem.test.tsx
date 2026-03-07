import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { ActivityItem } from "./ActivityItem";

describe("ActivityItem", () => {
  it("renders activity item", () => {
    render(
      <ActivityItem
        id="1"
        type="deploy"
        service="api"
        message="Deployed"
        timestamp="2 min ago"
        status="success"
      />
    );
    expect(screen.getByText("api")).toBeInTheDocument();
    expect(screen.getByText("Deployed")).toBeInTheDocument();
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });
});
