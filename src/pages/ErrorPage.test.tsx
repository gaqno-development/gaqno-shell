import { render, screen } from "@/test/utils";
import ErrorPage from "./ErrorPage";

describe("ErrorPage", () => {
  it("renders error message", () => {
    render(<ErrorPage />);
    expect(screen.getByText("Serviço Indisponível")).toBeInTheDocument();
  });
});
