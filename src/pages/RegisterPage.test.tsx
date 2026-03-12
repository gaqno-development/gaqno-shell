import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/utils";
import RegisterPage from "./RegisterPage";
import * as UseRegisterModule from "../hooks/useRegister";

vi.mock("../hooks/useRegister");

function getRegisterMockReturn(overrides: { error?: string; isSubmitting?: boolean } = {}) {
  const { useForm } = require("react-hook-form");
  return {
    form: useForm({
      defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    }),
    onSubmit: vi.fn(),
    isSubmitting: false,
    error: undefined as string | undefined,
    ...overrides,
  };
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.mocked(UseRegisterModule.useRegister).mockImplementation(
      getRegisterMockReturn as () => ReturnType<typeof UseRegisterModule.useRegister>
    );
  });

  it("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Faça login/i })).toBeInTheDocument();
  });

  it("shows error message when useRegister returns error", () => {
    vi.mocked(UseRegisterModule.useRegister).mockImplementation(
      () =>
        getRegisterMockReturn({ error: "E-mail já cadastrado" }) as ReturnType<
          typeof UseRegisterModule.useRegister
        >
    );
    render(<RegisterPage />);
    expect(screen.getByText("E-mail já cadastrado")).toBeInTheDocument();
  });

  it("shows loading state when isSubmitting is true", () => {
    vi.mocked(UseRegisterModule.useRegister).mockImplementation(
      () =>
        getRegisterMockReturn({ isSubmitting: true }) as ReturnType<
          typeof UseRegisterModule.useRegister
        >
    );
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /registrando/i })).toBeInTheDocument();
  });
});
