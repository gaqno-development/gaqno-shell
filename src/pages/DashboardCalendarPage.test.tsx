import { render, screen } from "@/test/utils";
import DashboardCalendarPage from "./DashboardCalendarPage";

describe("DashboardCalendarPage", () => {
  it("renders calendar page", () => {
    render(<DashboardCalendarPage />);
    expect(screen.getAllByText("dashboard.calendarTitle")[0]).toBeInTheDocument();
  });
});
