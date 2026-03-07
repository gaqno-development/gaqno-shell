import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ShellLayout } from "./shell-layout";
import { SHELL_MENU_ITEMS } from "@/config/shell-menu";

describe("ShellLayout", () => {
  it("renders layout with outlet", () => {
    render(
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
            <Route path="/dashboard" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });
});
