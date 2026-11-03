import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  GitCommitHorizontal,
  ListChecks,
  Mail,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn, relativeTime } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";
import { useState } from "react";

const iconMap = {
  deadline: { icon: Clock, cls: "bg-amber/10 text-amber" },
  verified: { icon: CheckCircle2, cls: "bg-accent/10 text-accent-bright" },
  activity: { icon: GitCommitHorizontal, cls: "bg-blue/10 text-blue" },
  attention: { icon: AlertTriangle, cls: "bg-danger/10 text-danger" },
  partner: { icon: Users, cls: "bg-violet/10 text-violet" },
  milestone: { icon: Flame, cls: "bg-amber/10 text-amber" },
  invite: { icon: Mail, cls: "bg-blue/10 text-blue" },
  commitments: { icon: ListChecks, cls: "bg-accent/10 text-accent-bright" },
} as const;

function NotificationRow({
  n,
  onRead,
  onClose,
}: {
  n: AppNotification;
  onRead: () => void;
  onClose: () => void;
}) {
  const { icon: Icon, cls } = iconMap[n.kind];
  return (
    <Link
      to={n.href ?? "/dashboard"}
      onClick={() => {
        onRead();
        onClose();
      }}
      className={cn(
        "flex gap-3 border-b border-line-soft px-4 py-3.5 transition-colors last:border-0 hover:bg-ink/[0.025]",
        !n.read && "bg-accent/[0.035]",
      )}
    >
      <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", cls)}>
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-[12.5px] leading-snug", n.read ? "font-medium text-muted" : "font-semibold text-ink")}>
            {n.title}
          </p>
          {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright" />}
        </div>
        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-faint">{n.body}</p>
        <p className="mt-1.5 font-mono text-[10px] text-faint">{relativeTime(n.time)}</p>
      </div>
    </Link>
  );
}

export function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [tab, setTab] = useState<"all" | "unread">("all");
  if (!open) return null;

  const list = tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-label="Notification centre">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] sm:bg-black/10 sm:backdrop-blur-0" onClick={onClose} />
      <div className="absolute inset-x-3 top-[62px] animate-scale-in overflow-hidden rounded-2xl border border-line bg-card shadow-lift sm:inset-x-auto sm:right-4 sm:w-[390px]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[13.5px] font-semibold text-ink">Notifications</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent-bright">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              className="rounded-md px-1.5 py-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="grid h-7 w-7 place-items-center rounded-md text-faint hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-line-soft px-4">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative py-2.5 text-[12px] font-medium capitalize transition-colors",
                tab === t ? "text-ink" : "text-faint hover:text-muted",
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-accent-bright" />}
            </button>
          ))}
        </div>

        <div className="max-h-[min(70vh,480px)] overflow-y-auto">
          {list.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent-bright">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[12.5px] font-medium text-ink">You're all caught up</p>
              <p className="mt-1 text-[11.5px] text-faint">New activity and reminders will appear here.</p>
            </div>
          ) : (
            list.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onRead={() => markNotificationRead(n.id)}
                onClose={onClose}
              />
            ))
          )}
        </div>

        <div className="border-t border-line bg-canvas/60 px-4 py-2.5 text-center">
          <Link
            to="/settings"
            onClick={onClose}
            className="text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
          >
            Notification preferences
          </Link>
        </div>
      </div>
    </div>
  );
}
