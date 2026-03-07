import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ServiceUsageChart } from "./ServiceUsageChart";

const config = {
  apiCalls: { label: "API Calls", color: "hsl(217 91% 60%)" },
  storage: { label: "Storage", color: "hsl(160 84% 39%)" },
  bandwidth: { label: "Bandwidth", color: "hsl(280 68% 60%)" },
};

const data = [
  { date: "2024-01-01", apiCalls: 100, storage: 50, bandwidth: 20 },
];

const labels = { "7d": "7d", "30d": "30d", "90d": "90d", "12m": "12m" };

describe("ServiceUsageChart", () => {
  it("renders and calls onTimeRangeChange", async () => {
    const onChange = vi.fn();
    render(
      <ServiceUsageChart
        data={data}
        config={config}
        timeRange="30d"
        timeRangeLabels={labels}
        onTimeRangeChange={onChange}
      />
    );
    const btn = screen.getByRole("button", { name: "30d" });
    expect(btn).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "7d" }));
    });
    expect(onChange).toHaveBeenCalledWith("7d");
  });
});
