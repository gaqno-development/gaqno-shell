import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Skeleton } from "@gaqno-development/frontcore/components/ui";
import { useTenants } from "@gaqno-development/frontcore/hooks/admin/useTenants";
import { Cpu, Image, Video, Music, BarChart3 } from "lucide-react";

const getSaasBase = (): string => {
  try {
    const env = (import.meta as { env?: Record<string, string> }).env;
    return env?.VITE_SERVICE_SAAS_URL ?? "http://localhost:4009";
  } catch {
    return "http://localhost:4009";
  }
};

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getSaasBase();
  const url = base ? `${base.replace(/\/$/, "")}${path}` : path;
  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export default function AIModelsPage() {
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const [tenantId, setTenantId] = useState<string>("");
  const [registry, setRegistry] = useState<{
    image?: {
      providers: {
        id: string;
        name: string;
        models: { id: string; name: string }[];
      }[];
    };
    video?: {
      providers: {
        id: string;
        name: string;
        models: { id: string; name: string }[];
      }[];
    };
    audio?: {
      providers: {
        id: string;
        name: string;
        models: { id: string; name: string }[];
      }[];
    };
  } | null>(null);
  const [defaults, setDefaults] = useState<{
    image?: string;
    video?: string;
    audio?: string;
  } | null>(null);
  const [usage, setUsage] = useState<{
    byCategory: Record<string, number>;
    byModel: Record<string, number>;
    totalCredits: number;
  } | null>(null);
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const loadRegistry = async () => {
    setLoadingRegistry(true);
    try {
      const data = await fetchJson<typeof registry>("/ai-models");
      setRegistry(data ?? null);
    } catch {
      setRegistry(null);
    } finally {
      setLoadingRegistry(false);
    }
  };

  const loadDefaults = async () => {
    if (!tenantId) return;
    setLoadingDefaults(true);
    try {
      const data = await fetchJson<{
        image?: string;
        video?: string;
        audio?: string;
      }>(`/ai-models/${encodeURIComponent(tenantId)}/defaults`);
      setDefaults(data ?? null);
    } catch {
      setDefaults(null);
    } finally {
      setLoadingDefaults(false);
    }
  };

  const loadUsage = async () => {
    if (!tenantId) return;
    setLoadingUsage(true);
    try {
      const data = await fetchJson<{
        byCategory: Record<string, number>;
        byModel: Record<string, number>;
        totalCredits: number;
      }>(`/costs/ai-usage?tenant_id=${encodeURIComponent(tenantId)}`);
      setUsage(data ?? null);
    } catch {
      setUsage(null);
    } finally {
      setLoadingUsage(false);
    }
  };

  React.useEffect(() => {
    loadRegistry();
  }, []);

  React.useEffect(() => {
    if (tenantId) {
      loadDefaults();
      loadUsage();
    } else {
      setDefaults(null);
      setUsage(null);
    }
  }, [tenantId]);

  const tenantList = React.useMemo(() => tenants ?? [], [tenants]);

  return (
    <div className="container mx-auto py-6 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Cpu className="h-8 w-8" />
          Modelos IA e custos
        </h1>
        <p className="text-muted-foreground mt-1">
          Catálogo de modelos NEX AI, padrões por tenant e consumo em créditos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
          <CardDescription>
            Selecione o tenant para ver padrões e uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tenantsLoading ? (
            <Skeleton className="h-10 w-[280px]" />
          ) : (
            <Select value={tenantId} onValueChange={setTenantId}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecione um tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenantList.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Modelos de imagem
          </CardTitle>
          <CardDescription>
            Modelos NEX AI para geração de imagem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRegistry ? (
            <Skeleton className="h-24 w-full" />
          ) : registry?.image?.providers?.length ? (
            <ul className="space-y-2">
              {registry.image.providers.flatMap((p) =>
                p.models.map((m) => (
                  <li key={m.id} className="text-sm flex justify-between">
                    <span>{m.name}</span>
                    <code className="text-muted-foreground">{m.id}</code>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum modelo carregado. Verifique VITE_SERVICE_SAAS_URL e o
              serviço de IA.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Modelos de vídeo
          </CardTitle>
          <CardDescription>
            Modelos NEX AI para geração de vídeo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRegistry ? (
            <Skeleton className="h-24 w-full" />
          ) : registry?.video?.providers?.length ? (
            <ul className="space-y-2">
              {registry.video.providers.flatMap((p) =>
                p.models.map((m) => (
                  <li key={m.id} className="text-sm flex justify-between">
                    <span>{m.name}</span>
                    <code className="text-muted-foreground">{m.id}</code>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum modelo de vídeo.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Modelos de áudio
          </CardTitle>
          <CardDescription>Modelos NEX AI para TTS e música</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRegistry ? (
            <Skeleton className="h-24 w-full" />
          ) : registry?.audio?.providers?.length ? (
            <ul className="space-y-2">
              {registry.audio.providers.flatMap((p) =>
                p.models.map((m) => (
                  <li key={m.id} className="text-sm flex justify-between">
                    <span>{m.name}</span>
                    <code className="text-muted-foreground">{m.id}</code>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum modelo de áudio.
            </p>
          )}
        </CardContent>
      </Card>

      {tenantId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Padrões do tenant</CardTitle>
              <CardDescription>
                Modelos padrão para este tenant (leitura; use a API para
                alterar)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDefaults ? (
                <Skeleton className="h-16 w-full" />
              ) : defaults ? (
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Imagem</dt>
                    <dd className="font-medium">{defaults.image ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Vídeo</dt>
                    <dd className="font-medium">{defaults.video ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Áudio</dt>
                    <dd className="font-medium">{defaults.audio ?? "—"}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Sem padrões ou serviço indisponível.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Uso (créditos)
              </CardTitle>
              <CardDescription>
                Consumo por categoria e modelo no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsage ? (
                <Skeleton className="h-24 w-full" />
              ) : usage ? (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">
                    {usage.totalCredits} créditos
                  </div>
                  {Object.keys(usage.byModel).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Por modelo</div>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(usage.byModel).map(
                          ([model, credits]) => (
                            <li key={model} className="flex justify-between">
                              <code className="text-muted-foreground truncate max-w-[200px]">
                                {model}
                              </code>
                              <span>{credits}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Sem dados de uso.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
