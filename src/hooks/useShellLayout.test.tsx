import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useShellLayout } from "./useShellLayout";
import { MemoryRouter } from "react-router-dom";
import * as uiStoreModule from "@gaqno-development/frontcore/store/uiStore";

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={["/dashboard"]}>{children}</MemoryRouter>
  );
}

describe("useShellLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns layout state", () => {
    const { result } = renderHook(() => useShellLayout(), { wrapper });
    expect(typeof result.current.shouldShowLayout).toBe("boolean");
    expect(typeof result.current.isMicroFrontend).toBe("boolean");
    expect(result.current.transitionKey).toBeDefined();
    expect(Array.isArray(result.current.menuItems)).toBe(true);
    expect(result.current.pageTransition).toBeDefined();
  });

  it("injects notificationCount into the omnichannel menu item", () => {
    const { result } = renderHook(() => useShellLayout(), { wrapper });
    const omnichannelItem = result.current.menuItems.find((item) =>
      item.href?.startsWith("/omnichannel"),
    );
    expect(omnichannelItem).toBeDefined();
    expect(omnichannelItem).toHaveProperty("notificationCount");
  });

  it("reflects omnichannelUnreadCount in the omnichannel menu item", () => {
    vi.spyOn(uiStoreModule, "useUIStore").mockImplementation(
      (selector?: (s: Record<string, unknown>) => unknown) => {
        const state = {
          sidebarOpen: false,
          setSidebarOpen: vi.fn(),
          omnichannelUnreadCount: 7,
          incrementOmnichannelUnread: vi.fn(),
          setOmnichannelUnreadCount: vi.fn(),
          resetOmnichannelUnread: vi.fn(),
        };
        return selector ? selector(state) : state;
      },
    );
    const { result } = renderHook(() => useShellLayout(), { wrapper });
    const omnichannelItem = result.current.menuItems.find((item) =>
      item.href?.startsWith("/omnichannel"),
    );
    expect(omnichannelItem?.notificationCount).toBe(7);
  });
});
