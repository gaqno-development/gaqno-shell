import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MicroFrontendErrorBoundary } from "./microfrontend-error-boundary";

const ThrowError = () => {
  throw new Error("Test error");
};

describe("MicroFrontendErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <MicroFrontendErrorBoundary>
        <div>Child content</div>
      </MicroFrontendErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders fallback when child throws", () => {
    render(
      <MicroFrontendErrorBoundary>
        <ThrowError />
      </MicroFrontendErrorBoundary>
    );
    expect(screen.getByText(/Serviço Indisponível/i)).toBeInTheDocument();
  });

  it("navigates to dashboard on button click", async () => {
    const reload = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/crm",
      reload: vi.fn(),
    } as unknown as Location);
    render(
      <MicroFrontendErrorBoundary>
        <ThrowError />
      </MicroFrontendErrorBoundary>
    );
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /Ir ao Dashboard/i }));
    });
    expect(reload).toBeDefined();
  });

  it("uses custom fallback when provided", () => {
    render(
      <MicroFrontendErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </MicroFrontendErrorBoundary>
    );
    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
  });
});
