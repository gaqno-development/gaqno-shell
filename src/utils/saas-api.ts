export function getSaasBase(): string {
  try {
    const env = (import.meta as { env?: Record<string, string> }).env;
    return env?.VITE_SERVICE_SAAS_URL ?? "http://localhost:4009";
  } catch {
    return "http://localhost:4009";
  }
}

export async function fetchSaasJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const base = getSaasBase();
  const url = base ? `${base.replace(/\/$/, "")}${path}` : path;
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
