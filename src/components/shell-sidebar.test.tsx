import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ShellSidebar } from "./shell-sidebar";
import { SHELL_MENU_ITEMS } from "@/config/shell-menu";

describe("ShellSidebar", () => {
  it("renders empty state when no menu items", () => {
    render(
      <MemoryRouter>
        <ShellSidebar menuItems={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Nenhum item de menu disponível/i)).toBeInTheDocument();
  });

  it("renders menu items", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ShellSidebar menuItems={SHELL_MENU_ITEMS} />
      </MemoryRouter>
    );
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
  });
});
