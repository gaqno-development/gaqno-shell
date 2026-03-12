import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test/utils";
import LoginPage from "./LoginPage";
import * as UseLoginModule from "../hooks/useLogin";

vi.mock("../hooks/useLogin");

function getLoginMockReturn(overrides: { error?: string; isSubmitting?: boolean } = {}) {
  const { useForm } = require("react-hook-form");
  return {
    form: useForm({ defaultValues: { email: "", password: "" } }),
    onSubmit: vi.fn(),
    isSubmitting: false,
    error: undefined as string | undefined,
    ...overrides,
  };
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(UseLoginModule.useLogin).mockImplementation(getLoginMockReturn as () => ReturnType<typeof UseLoginModule.useLogin>);
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /esqueci minha senha/i })).toBeInTheDocument();
  });

  it("shows error message when useLogin returns error", () => {
    vi.mocked(UseLoginModule.useLogin).mockImplementation(
      () => getLoginMockReturn({ error: "Credenciais inválidas" }) as ReturnType<typeof UseLoginModule.useLogin>
    );
    render(<LoginPage />);
    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("shows loading state when isSubmitting is true", () => {
    vi.mocked(UseLoginModule.useLogin).mockImplementation(
      () => getLoginMockReturn({ isSubmitting: true }) as ReturnType<typeof UseLoginModule.useLogin>
    );
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /entrando/i })).toBeInTheDocument();
  });

  it("renders link to register", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /registre-se/i })).toBeInTheDocument();
  });
});
