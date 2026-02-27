import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { BarChart3, ArrowUpRight } from "lucide-react";

const GRAFANA_BASE_URL =
  (import.meta as unknown as { env: { VITE_GRAFANA_URL?: string } }).env
    ?.VITE_GRAFANA_URL ?? "https://grafana.gaqno.com.br";

const MONITORING_LINKS = [
  {
    label: "Services overview",
    path: "/d/services-overview",
    description: "Prometheus + Cloudflare 503/5xx, quick links",
  },
  {
    label: "Front",
    path: "/d/gaqno-dashboard-front",
    description: "Error rate, LCP, 4xx/5xx by app, bundle size",
  },
  {
    label: "Backend",
    path: "/d/gaqno-dashboard-backend",
    description: "Error rate, latency, 5xx by service, DB, infra",
  },
  {
    label: "DevOps",
    path: "/d/gaqno-dashboard-devops",
    description: "DORA, CI/CD, targets, Cloudflare Tunnel",
  },
  {
    label: "DNS droppage",
    path: "/d/gaqno-dns-droppage",
    description: "Cloudflare DNS non-NOERROR queries",
  },
] as const;

export function MonitoringWidgets() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Monitoring</CardTitle>
            <CardDescription>Grafana dashboards</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MONITORING_LINKS.map(({ label, path, description }) => (
          <a
            key={path}
            href={`${GRAFANA_BASE_URL}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50 hover:border-border"
          >
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
