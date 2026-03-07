import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { MfeRouteLayout } from "./MfeRouteLayout";
import { ERP_MFE_CONFIG } from "@/config/mfe-route-config";

describe("MfeRouteLayout", () => {
  it("renders with config", () => {
    render(
      <MemoryRouter initialEntries={["/erp/dashboard"]}>
        <Routes>
          <Route path="/erp/*" element={<MfeRouteLayout config={ERP_MFE_CONFIG} />}>
            <Route path="dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
