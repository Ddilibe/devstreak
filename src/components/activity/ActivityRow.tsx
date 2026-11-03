import {
  CheckCircle2,
  Flame,
  GitBranch,
  GitMerge,
  GitPullRequest,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { personById } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon, platformName } from "@/components/brand/BrandIcons";
import { cn, relativeTime } from "@/lib/utils";

const typeMap = {
  commit: { icon: GitBranch, cls: "bg-blue/10 text-blue border-blue/20" },
  pull_request: { icon: GitPullRequest, cls: "bg-violet/10 text-violet border-violet/20" },
  merge: { icon: GitMerge, cls: "bg-accent/10 text-accent-bright border-accent/20" },
  review: { icon: MessageSquare, cls: "bg-blue/10 text-blue border-blue/20" },
  repo_update: { icon: RefreshCw, cls: "bg-amber/10 text-amber border-amber/20" },
  discussion: { icon: MessageSquare, cls: "bg-violet/10 text-violet border-violet/20" },
  sync: { icon: RefreshCw, cls: "bg-blue/10 text-blue border-blue/20" },
  verified: { icon: ShieldCheck, cls: "bg-accent/10 text-accent-bright border-accent/20" },
  partner: { icon: Users, cls: "bg-violet/10 text-violet border-violet/20" },
  milestone: { icon: Flame, cls: "bg-amber/10 text-amber border-amber/20" },
  missed: { icon: XCircle, cls: "bg-danger/10 text-danger border-danger/20" },
};

export function ActivityRow({
  event,
  showActor = true,
  className,
}: {
  event: ActivityEvent;
  showActor?: boolean;
  className?: string;
}) {
  const actor = personById(event.actorId);
  const cfg = typeMap[event.type];
  const Icon = cfg.icon;

  return (
    <div className={cn("flex items-start gap-3 py-3.5", className)}>
      <span className={cn("relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border", cfg.cls)}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className="text-[12.5px] font-medium leading-snug text-ink">{event.title}</p>
          <span className="shrink-0 font-mono text-[10px] text-faint">{relativeTime(event.time)}</span>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{event.detail}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {showActor && (
            <span className="inline-flex items-center gap-1.5">
              <Avatar person={actor} size="xs" className="h-4 w-4 text-[7px]" />
              <span className="text-[10.5px] text-faint">{actor.name}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
            <PlatformIcon platform={event.platform} className="h-2.5 w-2.5" />
            {platformName[event.platform]}
          </span>
          {event.taskTitle && (
            <span className="max-w-[220px] truncate rounded border border-line bg-ink/[0.025] px-1.5 py-0.5 text-[10px] text-muted">
              {event.taskTitle}
            </span>
          )}
          {event.verified === "verified" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent-bright">
              <CheckCircle2 className="h-2.5 w-2.5" /> Verified
            </span>
          )}
          {event.verified === "pending" && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber">
              <span className="h-1 w-1 rounded-full bg-amber" /> Awaiting verification
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
