import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { BarChart3, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const GRAFANA_BASE_URL =
  (import.meta as unknown as { env: { VITE_GRAFANA_URL?: string } }).env
    ?.VITE_GRAFANA_URL ?? "https://grafana.gaqno.com.br";

const MONITORING_LINKS = [
  { labelKey: "monServicesOverview", descKey: "monServicesOverviewDesc", path: "/d/services-overview" },
  { labelKey: "monFront", descKey: "monFrontDesc", path: "/d/gaqno-dashboard-front" },
  { labelKey: "monBackend", descKey: "monBackendDesc", path: "/d/gaqno-dashboard-backend" },
  { labelKey: "monDevOps", descKey: "monDevOpsDesc", path: "/d/gaqno-dashboard-devops" },
  { labelKey: "monDnsDroppage", descKey: "monDnsDroppageDesc", path: "/d/gaqno-dns-droppage" },
] as const;

export function MonitoringWidgets() {
  const { t } = useTranslation("navigation");

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{t("dashboard.monitoring")}</CardTitle>
            <CardDescription>{t("dashboard.grafanaDashboards")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MONITORING_LINKS.map(({ labelKey, descKey, path }) => (
          <a
            key={path}
            href={`${GRAFANA_BASE_URL}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50 hover:border-border"
          >
            <div>
              <p className="text-sm font-medium">{t(`dashboard.${labelKey}`)}</p>
              <p className="text-xs text-muted-foreground">{t(`dashboard.${descKey}`)}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
