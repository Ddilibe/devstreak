import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  Circle,
  ExternalLink,
  GitBranch,
  Link2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { Drawer } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcon, platformName } from "@/components/brand/BrandIcons";
import { useApp } from "@/context/AppContext";
import { cn, deadlineLabel } from "@/lib/utils";
import { CriteriaProgress, EvidenceList, StatusPill } from "./Verification";

export function TaskDrawer({
  task,
  open,
  onClose,
}: {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}) {
  const { verifyTask, toast } = useApp();
  if (!task) return null;

  const repo =
    task.platform === "github"
      ? task.project.split(" · ")[0]
      : task.platform === "huggingface"
        ? task.project
        : task.tag === "ML"
          ? "mangino/whisper-finetune"
          : task.id === "t2" || task.id === "t6"
            ? "devstreak/web-app"
            : "devstreak/auth-service";

  const checks = [
    { label: "Source task synchronized", done: true },
    {
      label: "Qualifying coding activity detected",
      done: task.evidence.some((e) => e.qualified),
    },
    { label: "Commitment criteria satisfied", done: task.commitmentMet },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={task.title}
      description={
        <span className="inline-flex items-center gap-1.5">
          <PlatformIcon platform={task.platform} className="h-3 w-3" />
          {platformName[task.platform]} · {task.project}
        </span>
      }
      width="max-w-2xl"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => toast({ tone: "info", title: "Opening source platform", description: `Launching the original task in ${platformName[task.platform]}.` })}
            className="inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open in {platformName[task.platform]}
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            {task.commitmentMet ? (
              <Badge tone="green" dot className="h-8 px-3 text-[11.5px]">
                Commitment verified
              </Badge>
            ) : (
              <Button variant="primary" size="sm" onClick={() => verifyTask(task.id)}>
                <ShieldCheck className="h-3.5 w-3.5" /> Run verification
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={task.status} />
          <Badge tone="neutral" className="font-mono text-[10px]">
            <CalendarClock className="h-3 w-3" /> {deadlineLabel(task.deadline)}
          </Badge>
          {task.tag && (
            <Badge tone="outline" className="text-[10px]">
              {task.tag}
            </Badge>
          )}
        </div>

        {task.status === "attention" && (
          <div className="flex gap-3 rounded-xl border border-danger/25 bg-danger/[0.06] p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <div>
              <p className="text-[12px] font-semibold text-danger">Source completion ≠ verified commitment</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                This task is marked done in {platformName[task.platform]}, but no qualifying coding
                activity was found. It will not count toward today's streak until evidence is detected.
              </p>
            </div>
          </div>
        )}

        <section>
          <SectionLabel index="1" color="blue">
            Source task
          </SectionLabel>
          <div className="mt-2.5 space-y-2 rounded-xl border border-line bg-canvas/50 p-3.5">
            <DetailRow label="Platform">
              <span className="inline-flex items-center gap-1.5">
                <PlatformIcon platform={task.platform} className="h-3.5 w-3.5" />
                {platformName[task.platform]}
              </span>
            </DetailRow>
            <DetailRow label="Project">
              <span className="text-ink">{task.project}</span>
            </DetailRow>
            <DetailRow label="Source status">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5",
                  task.sourceStatus === "done" ? "text-blue" : "text-muted",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {task.sourceStatus === "done"
                  ? "Done in source"
                  : task.sourceStatus === "doing"
                    ? "In progress"
                    : "Not started"}
              </span>
            </DetailRow>
            <DetailRow label="Last sync">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                <RefreshCw className="h-3 w-3 text-accent-bright" /> 4 minutes ago
              </span>
            </DetailRow>
            <p className="border-t border-line-soft pt-2 text-[11px] leading-relaxed text-faint">
              Syncing a task only mirrors its state. It does not verify that work happened.
            </p>
          </div>
        </section>

        <section>
          <SectionLabel index="2" color="violet">
            Coding activity
          </SectionLabel>
          <div className="mt-2.5">
            <EvidenceList task={task} />
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas/50 px-3 py-2.5">
              <span className="inline-flex min-w-0 items-center gap-2 text-[11.5px] text-muted">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-faint" />
                <span className="truncate font-mono">{repo}</span>
              </span>
              <button
                onClick={() => toast({ tone: "info", title: "Opening repository", description: `Opening ${repo} in a new tab.` })}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-blue hover:underline"
              >
                Open <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel index="3" color="green">
            Commitment verification
          </SectionLabel>
          <div className="mt-2.5 space-y-3">
            <CriteriaProgress task={task} />
            <div className="rounded-xl border border-line bg-canvas/50 p-3.5">
              <div className="space-y-2">
                {checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    {c.done ? (
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-accent/15 text-accent-bright">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <Circle className="h-4 w-4 text-faint/50" />
                    )}
                    <span className={cn("text-[11.5px]", c.done ? "text-ink" : "text-faint")}>
                      {c.label}
                    </span>
                    {c.done && <span className="ml-auto text-[10px] text-accent-bright">Passed</span>}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-2.5">
                <CheckCircle2
                  className={cn("h-4 w-4", task.commitmentMet ? "text-accent-bright" : "text-faint/40")}
                />
                <p className="text-[11px] text-muted">
                  {task.commitmentMet
                    ? "This commitment counts toward today's personal and group streaks."
                    : "This commitment will not count toward today's streak until all checks pass."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel index="4" color="neutral">
            Daily commitment history
          </SectionLabel>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Today", "Yesterday", "2 days ago", "3 days ago"].map((label, i) => {
              const met = i === 0 ? task.commitmentMet : i !== 2;
              return (
                <div
                  key={label}
                  className={cn(
                    "rounded-lg border p-2.5",
                    i === 0 ? "border-accent/25 bg-accent/[0.04]" : "border-line bg-canvas/40",
                  )}
                >
                  <p className="text-[10px] text-faint">{label}</p>
                  <p
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 text-[11px] font-medium",
                      met ? "text-accent-bright" : "text-danger",
                    )}
                  >
                    {met ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                    {met ? "Met" : "Missed"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-2 rounded-xl border border-line bg-ink/[0.02] px-3 py-2.5">
          <GitBranch className="h-3.5 w-3.5 text-faint" />
          <p className="text-[10.5px] leading-relaxed text-faint">
            DevStreak evaluates only activity within the commitment's timezone window. Manual edits
            to source tasks never bypass verification.
          </p>
        </div>
      </div>
    </Drawer>
  );
}

function SectionLabel({
  index,
  color,
  children,
}: {
  index: string;
  color: "blue" | "violet" | "green" | "neutral";
  children: React.ReactNode;
}) {
  const colors = {
    blue: "border-blue/30 bg-blue/10 text-blue",
    violet: "border-violet/30 bg-violet/10 text-violet",
    green: "border-accent/30 bg-accent/10 text-accent-bright",
    neutral: "border-line bg-ink/[0.04] text-muted",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={cn("grid h-5 w-5 place-items-center rounded-md border font-mono text-[10px] font-semibold", colors[color])}>
        {index}
      </span>
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{children}</h3>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[11.5px]">
      <span className="text-faint">{label}</span>
      <span className="text-right text-muted">{children}</span>
    </div>
  );
}
