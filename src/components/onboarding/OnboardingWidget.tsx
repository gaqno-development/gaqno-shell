import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  PartyPopper,
  Rocket,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Progress,
} from "@gaqno-development/frontcore/components/ui";
import { useOnboarding } from "@/hooks/useOnboarding";
import type { OnboardingStepId } from "@gaqno-development/types";

function StepItem({
  stepId,
  icon: Icon,
  titleKey,
  descriptionKey,
  status,
  onNavigate,
  onComplete,
}: {
  stepId: OnboardingStepId;
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  status: "pending" | "completed";
  onNavigate: () => void;
  onComplete: () => void;
}) {
  const { t } = useTranslation("navigation");
  const done = status === "completed";

  return (
    <motion.div
      data-testid={`onboarding-step-${stepId}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        done
          ? "opacity-60"
          : "hover:bg-accent/50"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {done ? (
          <CheckCircle2 className="size-5 text-emerald-500" />
        ) : (
          <Circle className="size-5 text-muted-foreground/50" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span
            className={`text-sm font-medium ${
              done ? "line-through text-muted-foreground" : ""
            }`}
          >
            {t(titleKey)}
          </span>
        </div>
        {!done && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(descriptionKey)}
          </p>
        )}
      </div>

      {!done && (
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onNavigate}
            data-testid={`onboarding-go-${stepId}`}
          >
            {t("onboarding.goAction")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-emerald-500 hover:text-emerald-400"
            onClick={onComplete}
            data-testid={`onboarding-complete-${stepId}`}
          >
            <CheckCircle2 className="size-3.5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function CelebrationState() {
  const { t } = useTranslation("navigation");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 py-4 text-center"
      data-testid="onboarding-celebration"
    >
      <PartyPopper className="size-10 text-amber-400" />
      <p className="text-sm font-medium">{t("onboarding.completed")}</p>
    </motion.div>
  );
}

export function OnboardingWidget() {
  const { t } = useTranslation("navigation");
  const {
    shouldShow,
    isLoading,
    expanded,
    setExpanded,
    completedCount,
    totalSteps,
    percentage,
    isAllComplete,
    completeStep,
    dismiss,
    navigateToStep,
    getStepStatus,
    steps,
  } = useOnboarding();

  if (!shouldShow || isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 z-50 w-80"
        data-testid="onboarding-widget"
      >
        {!expanded ? (
          <Button
            variant="default"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setExpanded(true)}
            data-testid="onboarding-expand"
          >
            <Rocket className="size-4" />
            <span>{t("onboarding.title")}</span>
            <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
              {t("onboarding.progress", {
                completed: completedCount,
                total: totalSteps,
              })}
            </span>
          </Button>
        ) : (
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Rocket className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">{t("onboarding.title")}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setExpanded(false)}
                  data-testid="onboarding-collapse"
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={dismiss}
                  data-testid="onboarding-dismiss"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t("onboarding.progress", {
                      completed: completedCount,
                      total: totalSteps,
                    })}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              {isAllComplete ? (
                <CelebrationState />
              ) : (
                <div className="space-y-0.5" data-testid="onboarding-steps">
                  {steps.map((step) => (
                    <StepItem
                      key={step.id}
                      stepId={step.id}
                      icon={step.icon}
                      titleKey={step.titleKey}
                      descriptionKey={step.descriptionKey}
                      status={getStepStatus(step.id)}
                      onNavigate={() => navigateToStep(step.id)}
                      onComplete={() => completeStep(step.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
