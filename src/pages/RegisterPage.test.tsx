import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import RegisterPage from "./RegisterPage";

describe("RegisterPage", () => {
  it("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Faça login/i })).toBeInTheDocument();
  });
});
