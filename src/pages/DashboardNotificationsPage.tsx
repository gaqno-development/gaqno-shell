import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Badge } from "@gaqno-development/frontcore/components/ui";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import type { ShellNotificationItem } from "@gaqno-development/frontcore/store/uiStore";
import { Bell, CheckCheck, MessageSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";

const APP_LABELS: Record<string, string> = {
  omnichannel: "Omnichannel",
  crm: "CRM",
  ai: "AI",
  erp: "ERP",
  finance: "Finance",
};

function NotificationRow({
  item,
  onMarkRead,
}: {
  item: ShellNotificationItem;
  onMarkRead: (id: string) => void;
}) {
  const timeLabel = formatDistanceToNow(new Date(item.receivedAt), {
    addSuffix: true,
  });

  return (
    <li
      role={!item.read ? "button" : undefined}
      tabIndex={!item.read ? 0 : undefined}
      onClick={() => !item.read && onMarkRead(item.id)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !item.read) {
          e.preventDefault();
          onMarkRead(item.id);
        }
      }}
      className={`flex items-start gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50 ${
        !item.read ? "cursor-pointer bg-muted/30" : ""
      }`}
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="size-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {APP_LABELS[item.app] ?? item.app}
          </span>
          {!item.read && (
            <span className="size-1.5 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-0.5 text-sm font-medium">
          {item.title ?? "New notification"}
        </p>
        {item.body && (
          <p className="mt-0.5 text-sm text-muted-foreground">{item.body}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{timeLabel}</p>
      </div>
    </li>
  );
}

export default function DashboardNotificationsPage() {
  const { t } = useTranslation("navigation");
  const shellNotifications = useUIStore((s) => s.shellNotifications);
  const markAllShellNotificationsRead = useUIStore(
    (s) => s.markAllShellNotificationsRead,
  );
  const clearShellNotifications = useUIStore((s) => s.clearShellNotifications);

  const unreadCount = shellNotifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    useUIStore.setState((state) => ({
      shellNotifications: state.shellNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
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
        <div className="flex items-center gap-2 self-start">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={markAllShellNotificationsRead}
            >
              <CheckCheck className="h-4 w-4" />
              {t("dashboard.notificationsMarkAllRead")}
            </Button>
          )}
          {shellNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={clearShellNotifications}
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
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
          {shellNotifications.length > 0 ? (
            <ul className="divide-y divide-border/50">
              {shellNotifications.map((n) => (
                <NotificationRow
                  key={n.id}
                  item={n}
                  onMarkRead={handleMarkRead}
                />
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
