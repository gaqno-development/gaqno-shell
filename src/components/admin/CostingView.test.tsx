import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CostingView } from "./CostingView";

describe("CostingView", () => {
  it("renders", () => {
    render(<CostingView />);
    expect(document.body).toBeTruthy();
  });
});
