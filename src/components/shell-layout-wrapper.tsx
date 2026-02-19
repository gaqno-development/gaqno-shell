import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider } from "@gaqno-development/frontcore/components/providers";
import { WhiteLabelProvider } from "@gaqno-development/frontcore/components/providers";
import { TenantProvider } from "@gaqno-development/frontcore/contexts";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";
import { ApplicationShellLayout } from "@/components/application-shell-layout";
import { useShellLayout } from "@/hooks/useShellLayout";

export function ShellLayoutWrapper() {
  const {
    shouldShowLayout,
    transitionKey,
    menuItems,
    pageTransition,
  } = useShellLayout();

  if (!shouldShowLayout) {
    return (
      <MicroFrontendErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            key={transitionKey}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </MicroFrontendErrorBoundary>
    );
  }

  return (
    <AppProvider>
      <WhiteLabelProvider>
        <TenantProvider>
          <ApplicationShellLayout
            menuItems={menuItems}
            transitionKey={transitionKey}
            pageTransition={pageTransition}
          />
        </TenantProvider>
      </WhiteLabelProvider>
    </AppProvider>
  );
}
