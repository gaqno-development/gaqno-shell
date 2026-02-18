import React, { Suspense } from "react";
import { useMicroFrontendLoader } from "../hooks/useMicroFrontendLoader";

interface MicroFrontendPageProps {
  remoteName: string;
  moduleName: string;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">Carregando módulo...</p>
      </div>
    </div>
  );
}

export function MicroFrontendPage({
  remoteName,
  moduleName,
}: MicroFrontendPageProps) {
  const { Component, error } = useMicroFrontendLoader({
    remoteName,
    moduleName,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">
            Error Loading Module
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}
