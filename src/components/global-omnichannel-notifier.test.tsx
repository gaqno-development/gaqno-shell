import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import React from "react";
import { GlobalNotificationHub } from "./global-omnichannel-notifier";
import { SHELL_NOTIFICATION_EVENT } from "@gaqno-development/frontcore/notifications";

const mockUseLocation = vi.hoisted(() =>
  vi.fn(() => ({ pathname: "/dashboard", key: "1" })),
);

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return { ...mod, useLocation: mockUseLocation, useNavigate: () => vi.fn() };
});

const incrementOmnichannelUnread = vi.fn();
const resetOmnichannelUnread = vi.fn();

vi.mock("@gaqno-development/frontcore/store/uiStore", () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ incrementOmnichannelUnread, resetOmnichannelUnread }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseLocation.mockReturnValue({ pathname: "/dashboard", key: "1" });
});

afterEach(() => {
  cleanup();
});

describe("GlobalNotificationHub", () => {
  it("renders without crashing and produces no visible output", () => {
    const { container } = render(<GlobalNotificationHub />);
    expect(container.firstChild).toBeNull();
  });

  it("increments unread badge for inbound omnichannel messages outside /omnichannel", () => {
    render(<GlobalNotificationHub />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent(SHELL_NOTIFICATION_EVENT, {
          detail: { app: "omnichannel", direction: "inbound" },
        }),
      );
    });
    expect(incrementOmnichannelUnread).toHaveBeenCalledOnce();
  });

  it("resets omnichannel unread when mounted on /omnichannel path", () => {
    mockUseLocation.mockReturnValue({ pathname: "/omnichannel/inbox", key: "1" });
    render(<GlobalNotificationHub />);
    expect(resetOmnichannelUnread).toHaveBeenCalledOnce();
    expect(incrementOmnichannelUnread).not.toHaveBeenCalled();
  });

  it("does not increment unread badge for outbound messages", () => {
    render(<GlobalNotificationHub />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent(SHELL_NOTIFICATION_EVENT, {
          detail: { app: "omnichannel", direction: "outbound" },
        }),
      );
    });
    expect(incrementOmnichannelUnread).not.toHaveBeenCalled();
  });
});
