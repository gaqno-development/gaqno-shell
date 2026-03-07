import { render, screen } from "@/test/utils";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders loading or redirecting message", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/redirecionando|carregando/i)
    ).toBeInTheDocument();
  });
});
