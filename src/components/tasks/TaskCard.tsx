import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { deadlineLabel, cn } from "@/lib/utils";
import { PlatformIcon, platformName } from "@/components/brand/BrandIcons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VerificationChain, StatusPill } from "./Verification";
import { useApp } from "@/context/AppContext";

export function TaskCard({
  task,
  onOpen,
  compact = false,
}: {
  task: Task;
  onOpen: (task: Task) => void;
  compact?: boolean;
}) {
  const { verifyTask } = useApp();
  const overdue = new Date(task.deadline).getTime() < Date.now() && !task.commitmentMet;

  return (
    <article
      className={cn(
        "group card relative flex flex-col overflow-hidden transition-all duration-200 hover:border-faint/40 hover:shadow-lift",
        task.status === "attention" && "border-danger/30",
      )}
    >
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-ink/[0.025] px-1.5 py-0.5 text-[10.5px] font-medium text-muted">
              <PlatformIcon platform={task.platform} className="h-3 w-3" />
              {platformName[task.platform]}
            </span>
            <span className="truncate text-[10.5px] text-faint">{task.project}</span>
          </div>
          <StatusPill status={task.status} className="shrink-0" />
        </div>

        <div>
          <button
            onClick={() => onOpen(task)}
            className="text-left text-[14px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors hover:text-accent-bright"
          >
            {task.title}
          </button>
          {!compact && (
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
              {task.description}
            </p>
          )}
        </div>

        <VerificationChain task={task} dense={compact} />

        {task.status === "attention" && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/25 bg-danger/[0.06] px-2.5 py-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
            <p className="text-[11px] leading-relaxed text-danger">
              Marked done in {platformName[task.platform]} but no qualifying activity was detected.
              The commitment is <strong className="font-semibold">not verified</strong>.
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-3">
          <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-faint">
            <span className={cn("inline-flex items-center gap-1", overdue && "text-danger")}>
              <Clock className="h-3 w-3" />
              {deadlineLabel(task.deadline)}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {task.evidence.length} evidence
            </span>
            {task.commitmentMet && (
              <Badge tone="green" dot className="text-[10px]">
                Counts today
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="xs" onClick={() => onOpen(task)}>
              Details <ArrowUpRight className="h-3 w-3" />
            </Button>
            {task.commitmentMet ? (
              <Button variant="soft" size="xs" onClick={() => onOpen(task)}>
                <CheckCircle2 className="h-3 w-3" /> Evidence
              </Button>
            ) : (
              <Button variant="secondary" size="xs" onClick={() => verifyTask(task.id)}>
                <ShieldCheck className="h-3 w-3" /> Verify
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
