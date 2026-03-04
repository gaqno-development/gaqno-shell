import React, { lazy } from "react";

const REMOTE_LOAD_TIMEOUT_MS = 18000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Remote module load timeout after ${ms}ms`));
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export function lazyWithTimeout<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  timeoutMs: number = REMOTE_LOAD_TIMEOUT_MS
): React.LazyExoticComponent<T> {
  return lazy(() => withTimeout(factory(), timeoutMs)) as React.LazyExoticComponent<T>;
}
