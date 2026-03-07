import { render, screen } from "@/test/utils";
import DashboardNotificationsPage from "./DashboardNotificationsPage";

describe("DashboardNotificationsPage", () => {
  it("renders notifications page", () => {
    render(<DashboardNotificationsPage />);
    const els = screen.getAllByText("dashboard.notificationsTitle");
    expect(els[0]).toBeInTheDocument();
  });
});
