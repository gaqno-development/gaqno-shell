import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useRouteError, useNavigate, useLocation } from "react-router-dom";
import { RouteErrorElement } from "./route-error-element";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useRouteError: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: "/dashboard", key: "1" })),
  };
});

function TestWrapper({ pathname = "/dashboard" }: { pathname?: string }) {
  (useLocation as ReturnType<typeof vi.fn>).mockReturnValue({ pathname, key: "1" });
  return (
    <MemoryRouter>
      <RouteErrorElement />
    </MemoryRouter>
  );
}

describe("RouteErrorElement", () => {
  it("renders error message", () => {
    vi.mocked(useRouteError).mockReturnValue(new Error("Test error"));
    render(<TestWrapper />);
    expect(screen.getByText(/Serviço Indisponível/i)).toBeInTheDocument();
  });

  it("renders not deployed state for intelligence", () => {
    vi.mocked(useRouteError).mockReturnValue(new Error("err"));
    render(<TestWrapper pathname="/intelligence/analytics" />);
    expect(screen.getByText(/Módulo em implantação/i)).toBeInTheDocument();
  });

  it("navigates to dashboard on button click", async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    vi.mocked(useRouteError).mockReturnValue(new Error("err"));
    render(<TestWrapper />);
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /Ir ao Dashboard/i }));
    });
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });
});
