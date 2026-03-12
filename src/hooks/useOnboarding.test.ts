import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOnboarding, ONBOARDING_STEPS } from "./useOnboarding";
import type { OnboardingProgress } from "@gaqno-development/types";
import { ONBOARDING_STEP_IDS } from "@gaqno-development/types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (opts?.completed != null && opts?.total != null)
        return `${opts.completed}/${opts.total}`;
      return key;
    },
    i18n: { changeLanguage: vi.fn() },
  }),
}));

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockPost = vi.fn();
vi.mock("@gaqno-development/frontcore/utils/api", () => ({
  ssoClient: {
    get: (...args: unknown[]) => mockGet(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

function createDefaultProgress(): OnboardingProgress {
  return {
    steps: ONBOARDING_STEP_IDS.map((id) => ({
      id,
      status: "pending" as const,
      completedAt: null,
    })),
    dismissed: false,
    dismissedAt: null,
    completedAt: null,
  };
}

function createPartialProgress(completedIds: string[]): OnboardingProgress {
  return {
    steps: ONBOARDING_STEP_IDS.map((id) => ({
      id,
      status: completedIds.includes(id) ? ("completed" as const) : ("pending" as const),
      completedAt: completedIds.includes(id)
        ? "2026-01-01T00:00:00.000Z"
        : null,
    })),
    dismissed: false,
    dismissedAt: null,
    completedAt: null,
  };
}

describe("useOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockGet.mockResolvedValue({ data: createDefaultProgress() });
  });

  it("should load progress with all steps pending", async () => {
    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.completedCount).toBe(0);
    expect(result.current.totalSteps).toBe(5);
    expect(result.current.percentage).toBe(0);
    expect(result.current.isAllComplete).toBe(false);
    expect(result.current.isDismissed).toBe(false);
    expect(result.current.shouldShow).toBe(true);
  });

  it("should compute correct derived state with partial completion", async () => {
    mockGet.mockResolvedValue({
      data: createPartialProgress(["configure-company", "invite-team"]),
    });

    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.completedCount).toBe(2);
    expect(result.current.percentage).toBe(40);
    expect(result.current.isAllComplete).toBe(false);
    expect(result.current.getStepStatus("configure-company")).toBe("completed");
    expect(result.current.getStepStatus("register-clients")).toBe("pending");
  });

  it("should detect all complete", async () => {
    const allDone: OnboardingProgress = {
      steps: ONBOARDING_STEP_IDS.map((id) => ({
        id,
        status: "completed" as const,
        completedAt: "2026-01-01T00:00:00.000Z",
      })),
      dismissed: false,
      dismissedAt: null,
      completedAt: "2026-01-01T00:00:00.000Z",
    };
    mockGet.mockResolvedValue({ data: allDone });

    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAllComplete).toBe(true);
    expect(result.current.percentage).toBe(100);
    expect(result.current.shouldShow).toBe(false);
  });

  it("should hide widget when dismissed", async () => {
    const dismissed: OnboardingProgress = {
      ...createDefaultProgress(),
      dismissed: true,
      dismissedAt: "2026-01-01T00:00:00.000Z",
    };
    mockGet.mockResolvedValue({ data: dismissed });

    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isDismissed).toBe(true);
    expect(result.current.shouldShow).toBe(false);
  });

  it("should call PATCH when completing a step", async () => {
    const updated = createPartialProgress(["configure-company"]);
    mockPatch.mockResolvedValue({ data: updated });

    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.completeStep("configure-company");
    });

    await waitFor(() =>
      expect(mockPatch).toHaveBeenCalledWith(
        "/onboarding/steps/configure-company"
      )
    );
  });

  it("should call POST when dismissing", async () => {
    const dismissed: OnboardingProgress = {
      ...createDefaultProgress(),
      dismissed: true,
      dismissedAt: "2026-01-01T00:00:00.000Z",
    };
    mockPost.mockResolvedValue({ data: dismissed });

    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.dismiss();
    });

    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith("/onboarding/dismiss")
    );
  });

  it("should navigate to step route", async () => {
    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.navigateToStep("connect-channels");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/omnichannel/whatsapp-business");
  });

  it("should toggle expanded state and persist in localStorage", async () => {
    const { result } = renderHook(() => useOnboarding(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.expanded).toBe(true);

    act(() => {
      result.current.setExpanded(false);
    });

    expect(result.current.expanded).toBe(false);
    expect(localStorage.getItem("gaqno:onboarding:expanded")).toBe("false");
  });

  it("should have step config with correct structure", () => {
    expect(ONBOARDING_STEPS).toHaveLength(5);
    for (const step of ONBOARDING_STEPS) {
      expect(step.id).toBeTruthy();
      expect(step.titleKey).toContain("onboarding.steps.");
      expect(step.descriptionKey).toContain("onboarding.steps.");
      expect(step.actionRoute).toMatch(/^\//);
      expect(step.icon).toBeDefined();
    }
  });
});
