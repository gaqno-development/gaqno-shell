import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, MessageSquare } from "lucide-react";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import type { ShellNotificationItem } from "@gaqno-development/frontcore/store/uiStore";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@gaqno-development/frontcore/components/ui/popover";

const APP_LABELS: Record<string, string> = {
  omnichannel: "Omnichannel",
  crm: "CRM",
  ai: "AI",
  erp: "ERP",
  finance: "Finance",
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationRow({ item }: { item: ShellNotificationItem }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 ${
        !item.read ? "bg-muted/30" : ""
      }`}
    >
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="size-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            {APP_LABELS[item.app] ?? item.app}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {timeAgo(item.receivedAt)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium">
          {item.title ?? "New notification"}
        </p>
        {item.body && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {item.body}
          </p>
        )}
      </div>
      {!item.read && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const shellNotifications = useUIStore((s) => s.shellNotifications);
  const markAllShellNotificationsRead = useUIStore(
    (s) => s.markAllShellNotificationsRead,
  );

  const unreadCount = shellNotifications.filter((n) => !n.read).length;
  const recent = shellNotifications.slice(0, 10);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={() => markAllShellNotificationsRead()}
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            recent.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))
          )}
        </div>

        <div className="border-t px-3 py-2">
          <Link
            to="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center text-xs font-medium text-primary hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
