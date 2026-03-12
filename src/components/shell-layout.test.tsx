import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ShellLayout } from "./shell-layout";
import { SHELL_MENU_ITEMS } from "@/config/shell-menu";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            element={
              <ShellLayout
                menuItems={SHELL_MENU_ITEMS}
                transitionKey="1"
                pageTransition={{
                  initial: { opacity: 1 },
                  animate: { opacity: 1 },
                  exit: { opacity: 1 },
                  transition: { duration: 0.2 },
                }}
              />
            }
          >
            <Route path="/dashboard" element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ShellLayout", () => {
  it("renders layout with outlet", () => {
    render(<div>Dashboard content</div>, { wrapper: Wrapper });
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });
});
