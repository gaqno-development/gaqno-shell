import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PublicLayout, RootLayout } from "./public-layout";

describe("PublicLayout", () => {
  it("renders outlet", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});

describe("RootLayout", () => {
  it("renders PublicLayout for public routes", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="login" element={<div>Login</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders ShellLayoutWrapper for private routes", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="dashboard" element={<div data-testid="dashboard-route">Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("dashboard-route")).toHaveTextContent("Dashboard");
  });
});
