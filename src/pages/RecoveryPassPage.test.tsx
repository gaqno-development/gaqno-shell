import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import RecoveryPassPage from "./RecoveryPassPage";

describe("RecoveryPassPage", () => {
  it("renders recovery form", () => {
    render(<RecoveryPassPage />);
    expect(screen.getByText("Recuperar senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao login/i })).toBeInTheDocument();
  });
});
