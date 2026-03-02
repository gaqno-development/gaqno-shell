import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider } from "@gaqno-development/frontcore/components/providers";
import { WhiteLabelProvider } from "@gaqno-development/frontcore/components/providers";
import { TenantProvider } from "@gaqno-development/frontcore/contexts";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";
import { RootErrorBoundary } from "@/components/root-error-boundary";
import { ShellLayout } from "@/components/shell-layout";
import { useShellLayout } from "@/hooks/useShellLayout";

export function ShellLayoutWrapper() {
  const {
    shouldShowLayout,
    transitionKey,
    menuItems,
    pageTransition,
  } = useShellLayout();

  // #region agent log
  (function _dbg() {
    const payload = { sessionId: 'd5bf67', location: 'shell-layout-wrapper.tsx:after-useShellLayout', message: 'ShellLayoutWrapper after useShellLayout', data: { shouldShowLayout, pathname: typeof window !== 'undefined' ? window.location.pathname : '', menuItemsLength: menuItems?.length ?? 0 }, timestamp: Date.now(), hypothesisId: 'A,E' };
    console.debug('[debug-d5bf67]', payload);
    try { fetch('http://127.0.0.1:7576/ingest/71308206-a154-49e9-9e17-2126d2469326', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'd5bf67' }, body: JSON.stringify(payload) }).catch(() => {}); } catch (_) {}
  })();
  // #endregion

  if (!shouldShowLayout) {
    return (
      <RootErrorBoundary>
        <AppProvider>
          <WhiteLabelProvider>
            <TenantProvider>
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
            </TenantProvider>
          </WhiteLabelProvider>
        </AppProvider>
      </RootErrorBoundary>
    );
  }

  return (
    <RootErrorBoundary>
      <AppProvider>
        <WhiteLabelProvider>
          <TenantProvider>
            <ShellLayout
              menuItems={menuItems}
              transitionKey={transitionKey}
              pageTransition={pageTransition}
            />
          </TenantProvider>
        </WhiteLabelProvider>
      </AppProvider>
    </RootErrorBoundary>
  );
}
