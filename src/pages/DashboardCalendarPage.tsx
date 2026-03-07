import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type CalendarView = "today" | "week" | "month";

export default function DashboardCalendarPage() {
  const { t } = useTranslation("navigation");
  const [view, setView] = useState<CalendarView>("today");
  const events: { id: string; title: string; time: string; date: string }[] =
    [];

  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.calendarTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.calendarSubtitle")}
          </p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("dashboard.calendarTitle")}
          </CardTitle>
          <CardDescription>{t("dashboard.calendarSubtitle")}</CardDescription>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as CalendarView)}
            className="mt-2"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="today">
                {t("dashboard.calendarToday")}
              </TabsTrigger>
              <TabsTrigger value="week">
                {t("dashboard.calendarWeek")}
              </TabsTrigger>
              <TabsTrigger value="month">
                {t("dashboard.calendarMonth")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-2 pt-0">
          {events.length > 0 ? (
            <ul className="divide-y divide-border/50">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    {event.time}
                  </span>
                  <span className="text-sm font-medium">{event.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {event.date}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("dashboard.calendarEmpty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
