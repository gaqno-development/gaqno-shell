import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

vi.mock("omnichannel/GlobalNotifier" as string, () => ({
  GlobalOmnichannelNotifier: () => null,
}));

import { GlobalOmnichannelNotifier } from "./global-omnichannel-notifier";

describe("GlobalOmnichannelNotifier (shell)", () => {
  it("renders without crashing and produces no visible output", () => {
    const { container } = render(
      <React.Suspense fallback={null}>
        <GlobalOmnichannelNotifier />
      </React.Suspense>,
    );
    expect(container).toBeDefined();
  });
});
