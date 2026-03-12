import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PublicLayout, RootLayout } from "./public-layout";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe("PublicLayout", () => {
  it("renders outlet", () => {
    render(
      <AppWrapper>
        <MemoryRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<div>Home</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppWrapper>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});

describe("RootLayout", () => {
  it("renders PublicLayout for public routes", () => {
    render(
      <AppWrapper>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="login" element={<div>Login</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppWrapper>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders ShellLayoutWrapper for private routes", () => {
    render(
      <AppWrapper>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="dashboard" element={<div data-testid="dashboard-route">Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppWrapper>
    );
    expect(screen.getByTestId("dashboard-route")).toHaveTextContent("Dashboard");
  });
});
