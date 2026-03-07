import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TenantCostsSummary } from "./TenantCostsSummary";

describe("TenantCostsSummary", () => {
  it("renders", () => {
    render(<TenantCostsSummary />);
    expect(document.body).toBeTruthy();
  });
});
