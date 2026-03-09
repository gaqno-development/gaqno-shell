import React, { Suspense, lazy } from "react";

const OmnichannelGlobalNotifier = lazy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => (import("omnichannel/GlobalNotifier" as string) as Promise<any>).then(
    (m) => ({ default: m.default ?? m.GlobalOmnichannelNotifier ?? m }),
  ),
);

export function GlobalOmnichannelNotifier() {
  return (
    <Suspense fallback={null}>
      <OmnichannelGlobalNotifier />
    </Suspense>
  );
}
