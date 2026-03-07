import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UsersList } from "./UsersList";

describe("UsersList", () => {
  it("renders", () => {
    render(<UsersList />);
    expect(document.body).toBeTruthy();
  });
});
