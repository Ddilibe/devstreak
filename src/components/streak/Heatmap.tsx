import { useMemo } from "react";
import { format, getDay } from "date-fns";
import { generateHeat } from "@/lib/data";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function cellClass(status: string, commits: number) {
  if (status === "complete") {
    if (commits >= 7) return "bg-emerald-400/90";
    if (commits >= 5) return "bg-emerald-400/65";
    if (commits >= 3) return "bg-emerald-400/45";
    return "bg-emerald-400/28";
  }
  if (status === "missed") return "bg-danger/25";
  if (status === "rest") return "bg-ink/[0.04]";
  if (status === "upcoming") return "border border-dashed border-line bg-transparent";
  return "bg-ink/[0.04]";
}

export function Heatmap({
  days = 126,
  className,
  showLegend = true,
}: {
  days?: number;
  className?: string;
  showLegend?: boolean;
}) {
  const heat = useMemo(() => generateHeat(days), [days]);

  const weeks = useMemo(() => {
    const padded: ((typeof heat)[number] | null)[] = [];
    const startDow = (getDay(heat[0].date) + 6) % 7;
    for (let i = 0; i < startDow; i++) padded.push(null);
    padded.push(...heat);
    const out: (typeof heat)[number][][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      const week = padded.slice(i, i + 7).filter(Boolean) as (typeof heat)[number][];
      if (week.length) out.push(week);
    }
    return out;
  }, [heat]);

  const monthLabels = weeks.map((week) => {
    if (!week.length) return "";
    const first = week[0];
    const show = first.date.getDate() <= 7;
    return show ? format(first.date, "MMM") : "";
  });

  return (
    <div className={className}>
      <div className="flex gap-1.5">
        <div className="mt-[18px] hidden shrink-0 flex-col gap-1 sm:flex">
          {DAYS.map((d, i) => (
            <div key={i} className="flex h-[13px] items-center text-[9px] text-faint">
              {d}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto pb-1 no-scrollbar">
          <div className="inline-flex min-w-full flex-col gap-1">
            <div className="flex gap-1">
              {monthLabels.map((label, i) => (
                <div key={i} className="w-[13px] shrink-0 text-[9px] text-faint">
                  {label}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week[di];
                    if (!day) return <div key={di} className="h-[13px] w-[13px]" />;
                    const label = `${format(day.date, "EEE, d MMM")} · ${
                      day.status === "complete" ? `${day.commits} commits` : day.status
                    }`;
                    return (
                      <div
                        key={di}
                        title={label}
                        aria-label={label}
                        className={cn(
                          "h-[13px] w-[13px] rounded-[3px] transition-transform hover:scale-125",
                          cellClass(day.status, day.commits),
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="mt-3 flex items-center justify-end gap-2 text-[9.5px] text-faint">
          <span>Less</span>
          <span className="h-[10px] w-[10px] rounded-[2px] bg-ink/[0.05]" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400/28" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400/45" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400/65" />
          <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400/90" />
          <span>More</span>
        </div>
      )}
    </div>
  );
}
