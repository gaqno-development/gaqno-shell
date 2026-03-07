import { render, screen } from "@/test/utils";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /esqueci minha senha/i })).toBeInTheDocument();
  });
});
