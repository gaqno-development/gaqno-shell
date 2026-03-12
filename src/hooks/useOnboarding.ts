import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ssoClient } from "@gaqno-development/frontcore/utils/api";
import {
  Building2,
  Users,
  UserPlus,
  MessageSquare,
  Zap,
} from "lucide-react";
import type { OnboardingProgress, OnboardingStepId } from "@gaqno-development/types";

const QUERY_KEY = ["onboarding", "progress"] as const;

const STORAGE_KEY = "gaqno:onboarding:expanded";

interface StepConfig {
  id: OnboardingStepId;
  titleKey: string;
  descriptionKey: string;
  benefitKey: string;
  actionRoute: string;
  icon: React.ElementType;
}

export const ONBOARDING_STEPS: readonly StepConfig[] = [
  {
    id: "configure-company",
    titleKey: "onboarding.steps.configure-company.title",
    descriptionKey: "onboarding.steps.configure-company.description",
    benefitKey: "onboarding.steps.configure-company.benefit",
    actionRoute: "/admin/organization",
    icon: Building2,
  },
  {
    id: "invite-team",
    titleKey: "onboarding.steps.invite-team.title",
    descriptionKey: "onboarding.steps.invite-team.description",
    benefitKey: "onboarding.steps.invite-team.benefit",
    actionRoute: "/admin/access/users",
    icon: Users,
  },
  {
    id: "register-clients",
    titleKey: "onboarding.steps.register-clients.title",
    descriptionKey: "onboarding.steps.register-clients.description",
    benefitKey: "onboarding.steps.register-clients.benefit",
    actionRoute: "/crm/customers/contacts",
    icon: UserPlus,
  },
  {
    id: "connect-channels",
    titleKey: "onboarding.steps.connect-channels.title",
    descriptionKey: "onboarding.steps.connect-channels.description",
    benefitKey: "onboarding.steps.connect-channels.benefit",
    actionRoute: "/omnichannel/whatsapp-business",
    icon: MessageSquare,
  },
  {
    id: "first-action",
    titleKey: "onboarding.steps.first-action.title",
    descriptionKey: "onboarding.steps.first-action.description",
    benefitKey: "onboarding.steps.first-action.benefit",
    actionRoute: "/crm/sales/orders",
    icon: Zap,
  },
] as const;

function retryUnless401(failureCount: number, error: unknown): boolean {
  if (isAxiosError(error) && error.response?.status === 401) return false;
  return failureCount < 2;
}

function getInitialExpanded(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export function useOnboarding() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [expanded, setExpandedState] = useState(getInitialExpanded);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const { data: progress, isLoading } = useQuery<OnboardingProgress>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await ssoClient.get<OnboardingProgress>(
        "/onboarding/progress"
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: retryUnless401,
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepId: OnboardingStepId) => {
      const { data } = await ssoClient.patch<OnboardingProgress>(
        `/onboarding/steps/${stepId}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async () => {
      const { data } = await ssoClient.post<OnboardingProgress>(
        "/onboarding/dismiss"
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  const completedCount = useMemo(
    () => progress?.steps?.filter((s) => s.status === "completed").length ?? 0,
    [progress]
  );

  const totalSteps = ONBOARDING_STEPS.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);
  const isAllComplete = completedCount === totalSteps;
  const isDismissed = progress?.dismissed ?? false;
  const shouldShow = !isLoading && !isDismissed && !(isAllComplete && progress?.completedAt);

  const completeStep = useCallback(
    (stepId: OnboardingStepId) => completeStepMutation.mutate(stepId),
    [completeStepMutation]
  );

  const dismiss = useCallback(
    () => dismissMutation.mutate(),
    [dismissMutation]
  );

  const navigateToStep = useCallback(
    (stepId: OnboardingStepId) => {
      const step = ONBOARDING_STEPS.find((s) => s.id === stepId);
      if (step) navigate(step.actionRoute);
    },
    [navigate]
  );

  const getStepStatus = useCallback(
    (stepId: OnboardingStepId) =>
      progress?.steps?.find((s) => s.id === stepId)?.status ?? "pending",
    [progress]
  );

  return {
    progress,
    isLoading,
    expanded,
    setExpanded,
    completedCount,
    totalSteps,
    percentage,
    isAllComplete,
    isDismissed,
    shouldShow,
    completeStep,
    dismiss,
    navigateToStep,
    getStepStatus,
    steps: ONBOARDING_STEPS,
  } as const;
}
