import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useServiceAvailability } from "./useServiceAvailability";

vi.mock("@gaqno-development/frontcore/config/service-urls", () => ({
  getServiceName: () => "Test",
  SERVICE_ROUTE_MAP: { "/crm": "" },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter initialEntries={["/crm"]}>{children}</MemoryRouter>;
}

describe("useServiceAvailability", () => {
  it("returns availability state", () => {
    const { result } = renderHook(() => useServiceAvailability(), { wrapper });
    expect(result.current).toHaveProperty("available");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("serviceName");
  });
});
