import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlobalOmnichannelSheet } from "./global-omnichannel-sheet";

describe("GlobalOmnichannelSheet", () => {
  it("renders sheet header", () => {
    render(<GlobalOmnichannelSheet />);
    expect(screen.getByText("Chat Omnicanal")).toBeInTheDocument();
  });
});
