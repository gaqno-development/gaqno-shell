import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TenantsList } from "./TenantsList";

describe("TenantsList", () => {
  it("renders", () => {
    render(<TenantsList />);
    expect(document.body).toBeTruthy();
  });
});
