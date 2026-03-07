import { render, screen } from "@/test/utils";
import { DashboardGrid } from "./DashboardGrid";

describe("DashboardGrid", () => {
  it("renders children", () => {
    render(
      <DashboardGrid widgets={[]}>
        <span>Child content</span>
      </DashboardGrid>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders with empty widgets", () => {
    const { container } = render(<DashboardGrid widgets={[]} />);
    expect(container.querySelector(".w-full")).toBeInTheDocument();
  });
});
