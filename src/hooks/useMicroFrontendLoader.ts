import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface UseMicroFrontendLoaderArgs {
  remoteName: string;
  moduleName: string;
}

export function useMicroFrontendLoader({
  remoteName,
  moduleName,
}: UseMicroFrontendLoaderArgs) {
  const { pathname } = useLocation();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const importPath = `${remoteName}/./${moduleName}`;

    const loadMicroFrontend = async () => {
      try {
        setError(null);
        setComponent(null);

        const logContext = {
          remoteName,
          moduleName,
          importPath,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href,
        };

        console.log(
          `[Module Federation] Attempting to load: ${importPath}`,
          logContext
        );

        if (
          typeof window !== "undefined" &&
          (window as unknown as { __FEDERATION__?: unknown }).__FEDERATION__
        ) {
          const federation = (window as unknown as { __FEDERATION__?: Record<string, unknown> })
            .__FEDERATION__;
          const remoteDetails = federation?.[remoteName]
            ? {
                exists: true,
                name: (federation[remoteName] as Record<string, unknown>)?.name,
                entry: (federation[remoteName] as Record<string, unknown>)?.entry,
                exposes:
                  (federation[remoteName] as Record<string, unknown>)?.exposes ||
                  "not available",
              }
            : "not found";

          const allRemotesInfo =
            federation ?
              Object.keys(federation).reduce(
                (acc, key) => {
                  acc[key] = {
                    name: (federation[key] as Record<string, unknown>)?.name,
                    entry: (federation[key] as Record<string, unknown>)?.entry,
                    type: typeof federation[key],
                    keys: Object.keys((federation[key] as object) || {}),
                    fullObject: federation[key],
                  };
                  return acc;
                },
                {} as Record<string, unknown>
              )
            : {};

          const instance = (federation as unknown as { __INSTANCES__?: { options?: { remotes?: unknown[] }; loadRemote?: (path: string) => Promise<unknown>; remoteHandler?: unknown; name?: string; snapshotHandler?: unknown }[] })?.__INSTANCES__?.[0];
          const instanceRemotes = instance?.options?.remotes || [];

          console.log(`[Module Federation] Runtime detected:`, {
            federationExists: !!federation,
            remotes: federation ? Object.keys(federation) : [],
            remoteInfo: remoteDetails,
            allRemotes: allRemotesInfo,
            instanceRemotes,
            instanceRemotesLength: instanceRemotes.length,
          });

          if (
            instance &&
            typeof (instance as { loadRemote?: (path: string) => Promise<unknown> }).loadRemote ===
              "function"
          ) {
            try {
              console.log(
                `[Module Federation] Using loadRemote API with path: ${importPath}`
              );
              const moduleOrFactory = await (
                instance as { loadRemote: (path: string) => Promise<unknown> }
              ).loadRemote(`${remoteName}/./${moduleName}`);
              const container =
                typeof moduleOrFactory === "function"
                  ? await (moduleOrFactory as () => Promise<{ default?: React.ComponentType }>)()
                  : (moduleOrFactory as { default?: React.ComponentType });
              if (isMounted) {
                const RemoteComponent = container?.default ?? container;
                if (RemoteComponent) {
                  setComponent(() => RemoteComponent as React.ComponentType);
                  return;
                }
              }
            } catch {
              // fall through to direct import
            }
          }
        }

        let container: { default?: React.ComponentType } | null = null;
        let importError: Error | null = null;

        try {
          container = await import(
            /* @vite-ignore */ importPath
          ) as { default?: React.ComponentType };
        } catch (err) {
          importError = err instanceof Error ? err : new Error(String(err));
          const altImportPath = `${remoteName}/${moduleName}`;
          try {
            container = await import(
              /* @vite-ignore */ altImportPath
            ) as { default?: React.ComponentType };
          } catch (altErr) {
            throw importError;
          }
        }

        const RemoteComponent = container?.default ?? container;

        if (isMounted && RemoteComponent) {
          setComponent(() => RemoteComponent as React.ComponentType);
        } else if (isMounted) {
          setError(`Component not found in container for ${importPath}`);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error
              ? `Failed to load ${remoteName}: ${err.message}`
              : `Failed to load ${remoteName}. Please ensure the micro-frontend is running.`;
          setError(errorMessage);
        }
      }
    };

    loadMicroFrontend();

    return () => {
      isMounted = false;
    };
  }, [remoteName, moduleName, pathname]);

  return { Component, error };
}
