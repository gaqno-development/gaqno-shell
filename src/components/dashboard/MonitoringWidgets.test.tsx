import { render, screen } from "@/test/utils";
import { describe, it, expect } from "vitest";
import { MonitoringWidgets } from "./MonitoringWidgets";

describe("MonitoringWidgets", () => {
  it("renders monitoring links", () => {
    render(<MonitoringWidgets />);
    expect(screen.getByText(/dashboard\.monitoring|monitoring/i)).toBeInTheDocument();
  });
});
