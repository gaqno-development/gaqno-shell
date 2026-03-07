import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/utils";
import { MicroFrontendPage } from "./MicroFrontendPage";
import { useMicroFrontendLoader } from "../hooks/useMicroFrontendLoader";

vi.mock("../hooks/useMicroFrontendLoader");

describe("MicroFrontendPage", () => {
  beforeEach(() => {
    vi.mocked(useMicroFrontendLoader).mockReturnValue({
      Component: null,
      error: null,
    });
  });

  it("shows loading when no Component", () => {
    render(<MicroFrontendPage remoteName="test" moduleName="App" />);
    expect(screen.getByText(/Carregando módulo/i)).toBeInTheDocument();
  });

  it("shows error when error is set", () => {
    vi.mocked(useMicroFrontendLoader).mockReturnValue({
      Component: null,
      error: "Module failed",
    });
    render(<MicroFrontendPage remoteName="test" moduleName="App" />);
    expect(screen.getByText("Módulo não disponível")).toBeInTheDocument();
    expect(screen.getByText("Module failed")).toBeInTheDocument();
  });

  it("renders Component when loaded", () => {
    const MockComp = () => <div>Loaded</div>;
    vi.mocked(useMicroFrontendLoader).mockReturnValue({
      Component: MockComp,
      error: null,
    });
    render(<MicroFrontendPage remoteName="test" moduleName="App" />);
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });
});
