import React from "react";
import { render as rtlRender, screen, renderHook as rtlRenderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function render(ui: React.ReactElement, options?: { wrapper?: React.ComponentType }) {
  const { wrapper: CustomWrapper, ...rest } = options ?? {};
  return rtlRender(ui, {
    ...rest,
    wrapper: ({ children }) => (
      <AllTheProviders>
        {CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children}
      </AllTheProviders>
    ),
  });
}

export function renderHook<T>(hook: () => T, options?: { wrapper?: React.ComponentType }) {
  return rtlRenderHook(hook, {
    wrapper: ({ children }) => (
      <AllTheProviders>
        {options?.wrapper ? React.createElement(options.wrapper, null, children) : children}
      </AllTheProviders>
    ),
    ...options,
  });
}

export { screen, userEvent, act };
