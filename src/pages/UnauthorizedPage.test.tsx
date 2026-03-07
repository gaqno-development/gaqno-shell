import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent, act } from "@/test/utils";
import UnauthorizedPage from "./UnauthorizedPage";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

describe("UnauthorizedPage", () => {
  it("renders unauthorized message", () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Acesso Negado")).toBeInTheDocument();
  });

  it("navigates to dashboard on button click", async () => {
    render(
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    );
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /Voltar ao Dashboard/i }));
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
