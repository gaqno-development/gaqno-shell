import { render, screen } from "@/test/utils";
import DashboardTasksPage from "./DashboardTasksPage";

describe("DashboardTasksPage", () => {
  it("renders tasks page", () => {
    render(<DashboardTasksPage />);
    expect(screen.getAllByText("dashboard.tasksTitle")[0]).toBeInTheDocument();
  });
});
