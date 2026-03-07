import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DomainsList } from "./DomainsList";

describe("DomainsList", () => {
  it("renders", () => {
    render(<DomainsList />);
    expect(document.body).toBeTruthy();
  });
});
