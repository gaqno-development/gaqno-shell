import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Badge } from "@gaqno-development/frontcore/components/ui";
import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export default function DashboardNotificationsPage() {
  const { t } = useTranslation("navigation");
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.notificationsTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.notificationsSubtitle")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 self-start"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="h-4 w-4" />
            {t("dashboard.notificationsMarkAllRead")}
          </Button>
        )}
      </div>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.notificationsTitle")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.notificationsSubtitle")}
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} {t("dashboard.notificationsUnread")}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="px-2 pt-0">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-border/50">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      !n.read
                    ) {
                      e.preventDefault();
                      handleMarkRead(n.id);
                    }
                  }}
                  className={`flex items-start gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50 ${
                    !n.read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("dashboard.notificationsEmpty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
