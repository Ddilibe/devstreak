import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-ink/[0.015] px-6 text-center",
        compact ? "py-8" : "py-14",
        className,
      )}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-card text-faint shadow-sm">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-[14px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
