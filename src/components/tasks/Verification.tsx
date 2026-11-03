import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  FileCheck2,
  GitBranch,
  Info,
  ShieldCheck,
} from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlatformIcon, platformName } from "@/components/brand/BrandIcons";

export const statusConfig: Record<
  TaskStatus,
  { label: string; tone: "neutral" | "blue" | "violet" | "green" | "red"; className: string }
> = {
  pending: {
    label: "Pending",
    tone: "neutral",
    className: "border-line bg-ink/[0.04] text-muted",
  },
  in_progress: {
    label: "In progress",
    tone: "blue",
    className: "border-blue/25 bg-blue/10 text-blue",
  },
  activity: {
    label: "Activity detected",
    tone: "violet",
    className: "border-violet/25 bg-violet/10 text-violet",
  },
  verified: {
    label: "Verified",
    tone: "green",
    className: "border-accent/25 bg-accent/10 text-accent-bright",
  },
  attention: {
    label: "Needs attention",
    tone: "red",
    className: "border-danger/25 bg-danger/10 text-danger",
  },
};

export function StatusPill({ status, className }: { status: TaskStatus; className?: string }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        cfg.className,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "verified" && "bg-accent-bright",
          status === "activity" && "bg-violet",
          status === "in_progress" && "bg-blue",
          status === "attention" && "bg-danger",
          status === "pending" && "bg-faint",
        )}
      />
      {cfg.label}
    </span>
  );
}

export function VerificationChain({ task, dense = false }: { task: Task; dense?: boolean }) {
  const sourceLabel =
    task.sourceStatus === "done"
      ? `Done in ${platformName[task.platform]}`
      : task.sourceStatus === "doing"
        ? `In progress in ${platformName[task.platform]}`
        : `Not started in ${platformName[task.platform]}`;

  const qualifying = task.evidence.filter((e) => e.qualified).length;
  const evidenceLabel =
    task.evidence.length === 0
      ? "No activity detected"
      : `${task.evidence.length} signal${task.evidence.length > 1 ? "s" : ""} · ${qualifying} qualifying`;

  const commitmentLabel = task.commitmentMet
    ? "Criteria met"
    : task.evidence.length > 0
      ? "Criteria not yet met"
      : "Awaiting activity";

  return (
    <div className={cn("grid grid-cols-1 gap-1.5 sm:grid-cols-3", dense && "text-[11px]")}>
      <ChainCell
        label="Source task"
        value={sourceLabel}
        tone={task.sourceStatus === "done" ? "blue" : "neutral"}
        icon={<PlatformIcon platform={task.platform} className="h-3 w-3" />}
        note="Synchronized"
      />
      <ChainCell
        label="Coding evidence"
        value={evidenceLabel}
        tone={task.evidence.length > 0 ? "violet" : "neutral"}
        icon={<GitBranch className="h-3 w-3" />}
        note={evidenceLabel}
      />
      <ChainCell
        label="Commitment"
        value={commitmentLabel}
        tone={task.commitmentMet ? "green" : task.status === "attention" ? "red" : "amber"}
        icon={
          task.commitmentMet ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : task.status === "attention" ? (
            <Info className="h-3 w-3" />
          ) : (
            <Circle className="h-3 w-3" />
          )
        }
        note={task.criteria}
      />
    </div>
  );
}

function ChainCell({
  label,
  value,
  note,
  tone,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  tone: "blue" | "violet" | "green" | "amber" | "red" | "neutral";
  icon: React.ReactNode;
}) {
  const toneMap = {
    blue: "border-blue/20 bg-blue/[0.055] text-blue",
    violet: "border-violet/20 bg-violet/[0.055] text-violet",
    green: "border-accent/20 bg-accent/[0.055] text-accent-bright",
    amber: "border-amber/20 bg-amber/[0.055] text-amber",
    red: "border-danger/20 bg-danger/[0.055] text-danger",
    neutral: "border-line bg-ink/[0.02] text-faint",
  };
  return (
    <div className={cn("rounded-lg border px-2.5 py-2", toneMap[tone])} title={note}>
      <div className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <p className="mt-0.5 truncate text-[11.5px] font-medium">{value}</p>
    </div>
  );
}

export function VerificationLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] text-faint",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm border border-blue/40 bg-blue/15" />
        Task sync <span className="text-faint/60">— exists in source</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm border border-violet/40 bg-violet/15" />
        Activity evidence <span className="text-faint/60">— coding detected</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm border border-accent/40 bg-accent/15" />
        Commitment <span className="text-faint/60">— criteria satisfied</span>
      </span>
    </div>
  );
}

const evidenceIcon = {
  commit: GitBranch,
  pull_request: FileCheck2,
  merge: ShieldCheck,
  review: Check,
  repo_update: FileCheck2,
  discussion: Info,
};

export function EvidenceList({ task }: { task: Task }) {
  if (task.evidence.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-4 py-5 text-center">
        <p className="text-[12px] font-medium text-muted">No coding activity detected yet</p>
        <p className="mt-1 text-[11px] text-faint">
          DevStreak checks {task.platform === "manual" ? "connected platforms" : platformName[task.platform]} every few minutes.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-3">
      {task.evidence.map((e, i) => {
        const Icon = evidenceIcon[e.type] ?? GitBranch;
        return (
          <li key={e.id} className="relative flex gap-3">
            {i < task.evidence.length - 1 && (
              <span className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-line" />
            )}
            <span
              className={cn(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-lg border",
                e.qualified
                  ? "border-accent/30 bg-accent/10 text-accent-bright"
                  : "border-line bg-surface text-faint",
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] font-medium text-ink">{e.label}</p>
                <span className="shrink-0 font-mono text-[10px] text-faint">
                  {new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{e.detail}</p>
              {e.qualified && (
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-accent-bright">
                  <Check className="h-2.5 w-2.5" /> Counts toward criteria
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function CriteriaProgress({ task }: { task: Task }) {
  const qualifying = task.evidence.filter((e) => e.qualified).length;
  const total = 2;
  const met = task.commitmentMet ? total : Math.min(qualifying, total - 1);
  return (
    <div className="rounded-xl border border-line bg-canvas/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-bright" />
          Completion criteria
        </div>
        <span className="number text-[10.5px] text-faint">
          {met}/{total}
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] font-medium text-ink">{task.criteria}</p>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < met ? "bg-accent-bright" : "bg-ink/10",
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className={task.commitmentMet ? "text-accent-bright" : "text-amber"}>
          {task.commitmentMet ? "Verified by coding activity" : "Not yet satisfied"}
        </span>
        <span className="inline-flex items-center gap-1 text-faint">
          <ArrowRight className="h-2.5 w-2.5" /> counts toward streak
        </span>
      </div>
    </div>
  );
}
