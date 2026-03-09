import React, { Suspense, lazy } from "react";

// @ts-nocheck
const OmnichannelGlobalNotifier = lazy(
  () => import("omnichannel/GlobalNotifier" as string),
);

export function GlobalOmnichannelNotifier() {
  return (
    <Suspense fallback={null}>
      <OmnichannelGlobalNotifier />
    </Suspense>
  );
}
