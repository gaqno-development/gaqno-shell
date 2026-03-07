import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getWidgetComponent } from "./widget-registry";

describe("widget-registry", () => {
  it("returns ServiceMetricsWidget for unknown type", () => {
    const Widget = getWidgetComponent("unknown");
    render(<Widget />);
    expect(screen.getByText(/Metrics/)).toBeInTheDocument();
  });

  it("returns correct widget for crm-overview", () => {
    const Widget = getWidgetComponent("crm-overview");
    render(<Widget service="CRM" />);
    expect(screen.getByText("CRM Metrics")).toBeInTheDocument();
  });

  it("returns AggregatedMetricsWidget for aggregated-revenue", () => {
    const Widget = getWidgetComponent("aggregated-revenue");
    render(<Widget />);
    expect(screen.getByText("Aggregated Revenue")).toBeInTheDocument();
  });

  it("returns QuickActionsWidget for quick-actions", () => {
    const Widget = getWidgetComponent("quick-actions");
    render(<Widget />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });
});
