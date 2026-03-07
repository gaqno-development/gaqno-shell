import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ShellLayoutWrapper } from "./shell-layout-wrapper";

describe("ShellLayoutWrapper", () => {
  it("renders loading when auth loading", () => {
    vi.mock("@gaqno-development/frontcore/hooks", () => ({
      useAuth: () => ({ loading: true, user: null }),
    }));
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ShellLayoutWrapper />}>
            <Route index element={<div>Outlet</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });
});
