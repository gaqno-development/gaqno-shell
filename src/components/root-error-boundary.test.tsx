import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent, act } from "@/test/utils";
import { RootErrorBoundary } from "./root-error-boundary";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

describe("RootErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <MemoryRouter>
        <RootErrorBoundary>
          <div>Child</div>
        </RootErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders fallback when child throws", () => {
    const Throw = () => {
      throw new Error("Test error");
    };
    render(
      <MemoryRouter>
        <RootErrorBoundary>
          <Throw />
        </RootErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText("Erro ao carregar o portal")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("onRetry clears error", async () => {
    const Throw = () => {
      throw new Error("Test");
    };
    render(
      <MemoryRouter>
        <RootErrorBoundary>
          <Throw />
        </RootErrorBoundary>
      </MemoryRouter>
    );
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /Ir para o Dashboard/i }));
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
