import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Clock, Flame, ShieldCheck, Users } from "lucide-react";
import type { Group } from "@/lib/types";
import { personById } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function GroupCard({ group, compact = false }: { group: Group; compact?: boolean }) {
  const members = group.memberIds.map(personById);
  const progress = Math.round((group.memberDone / group.memberTotal) * 100);
  const qualified = group.todayQualified;

  return (
    <Link
      to={`/accountability/${group.id}`}
      className="group card card-hover flex flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-lg">
              {group.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[13.5px] font-semibold text-ink">{group.name}</h3>
              <p className="truncate text-[10.5px] text-faint">
                {group.memberIds.length} members · {group.timezone.split("/")[1]?.replace("_", " ")}
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-faint">Group streak</span>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <Flame className={cn("h-4 w-4", group.streak > 0 ? "text-amber" : "text-faint")} fill="currentColor" fillOpacity={0.2} />
              <span className="number text-xl font-semibold text-ink">{group.streak}</span>
              <span className="text-[10.5px] text-faint">days</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium uppercase tracking-wider text-faint">All-time best</span>
            <p className="number mt-0.5 text-[13px] font-medium text-muted">{group.longest} days</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-[10.5px]">
            <span className="text-faint">Today's participation</span>
            <span className="number font-medium text-muted">
              {group.memberDone}/{group.memberTotal} complete
            </span>
          </div>
          <Progress value={progress} color={qualified ? "green" : progress > 50 ? "amber" : "neutral"} size="sm" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {members.slice(0, 4).map((m, i) => (
                <Avatar
                  key={m.id}
                  person={m}
                  size="sm"
                  ring
                  className={i === 0 ? "" : "-ml-2.5"}
                />
              ))}
            </div>
            {!compact && (
              <div className="flex -space-x-0.5">
                {members.slice(0, 4).map((m) => (
                  <span
                    key={m.id}
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full border border-card",
                      m.today === "complete" && "bg-accent-bright",
                      m.today === "in_progress" && "bg-blue",
                      m.today === "pending" && "bg-faint/50",
                      m.today === "attention" && "bg-danger",
                    )}
                    title={`${m.name} — ${m.today.replace("_", " ")}`}
                  >
                    {m.today === "complete" && <Check className="h-2 w-2 text-canvas" strokeWidth={3.5} />}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Badge tone={qualified ? "green" : "amber"} dot className="text-[10px]">
            {qualified ? "Qualified" : "In progress"}
          </Badge>
        </div>

        {!compact && (
          <div
            className={cn(
              "mt-auto flex items-start gap-2 rounded-lg border px-2.5 py-2",
              qualified
                ? "border-accent/20 bg-accent/[0.05]"
                : "border-amber/20 bg-amber/[0.05]",
            )}
          >
            {qualified ? (
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
            ) : (
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
            )}
            <p className="text-[10.5px] leading-relaxed text-muted">{group.qualificationNote}</p>
          </div>
        )}

        {compact && (
          <div className="flex items-center justify-between border-t border-line-soft pt-3">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] text-faint">
              <Users className="h-3 w-3" /> {group.policy}
            </span>
            <span className="text-[10.5px] font-medium text-muted group-hover:text-accent-bright">
              View group →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
