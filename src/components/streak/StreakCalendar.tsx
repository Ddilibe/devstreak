import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { Check, ChevronLeft, ChevronRight, Flame, Minus } from "lucide-react";
import { generateHeat } from "@/lib/data";
import { cn } from "@/lib/utils";

const heat = generateHeat(200);
const heatByKey = new Map(heat.map((d) => [d.key, d]));

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCalendar({ className }: { className?: string }) {
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const month = addMonths(today, offset);
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leading = (getDay(startOfMonth(month)) + 6) % 7;
  const isCurrent = isSameMonth(month, today);

  return (
    <div className={cn("card p-4 sm:p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-ink">
            {format(month, "MMMM yyyy")}
          </h3>
          <p className="mt-0.5 text-[10.5px] text-faint">Daily commitment calendar</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="grid h-7 w-7 place-items-center rounded-md border border-line text-faint transition-colors hover:bg-ink/[0.04] hover:text-ink"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setOffset(0)}
            disabled={isCurrent}
            className="rounded-md px-1.5 py-1 text-[10.5px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            Today
          </button>
          <button
            onClick={() => setOffset((o) => Math.min(o + 1, 0))}
            disabled={offset >= 0}
            className="grid h-7 w-7 place-items-center rounded-md border border-line text-faint transition-colors hover:bg-ink/[0.04] hover:text-ink disabled:opacity-40"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {weekdays.map((d, i) => (
          <div key={i} className="pb-1 text-center font-mono text-[9.5px] font-medium text-faint">
            {d}
          </div>
        ))}
        {Array.from({ length: leading }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const entry = heatByKey.get(key);
          const future = day.getTime() > today.getTime();
          const isToday = isSameDay(day, today);
          const status = future ? "upcoming" : (entry?.status ?? "rest");

          return (
            <div
              key={key}
              className={cn(
                "group relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[10.5px] transition-colors",
                status === "complete" && "border-accent/25 bg-accent/[0.11] text-accent-bright hover:bg-accent/[0.18]",
                status === "missed" && "border-danger/20 bg-danger/[0.08] text-danger hover:bg-danger/[0.14]",
                status === "rest" && "border-line bg-ink/[0.025] text-faint",
                status === "upcoming" && "border-dashed border-line/70 text-faint/60",
                isToday && "ring-2 ring-amber/60 ring-offset-1 ring-offset-card",
              )}
              title={
                isToday
                  ? `${format(day, "d MMM")} · in progress`
                  : status === "complete"
                    ? `${format(day, "d MMM")} · commitment met`
                    : status === "missed"
                      ? `${format(day, "d MMM")} · missed`
                      : `${format(day, "d MMM")} · no commitment`
              }
            >
              <span className={cn("number font-medium", status === "complete" && "opacity-90")}>
                {format(day, "d")}
              </span>
              {status === "complete" && <Check className="mt-0.5 h-2.5 w-2.5" strokeWidth={3} />}
              {status === "missed" && <span className="mt-1 h-1 w-1 rounded-full bg-current" />}
              {isToday && (
                <Flame className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-card p-[1px] text-amber" />
              )}
              {status === "rest" && <Minus className="mt-0.5 h-2 w-2 opacity-40" />}
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-soft pt-3 text-[10px] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-accent/30 bg-accent/15" /> Met
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-amber/50 bg-amber/10" /> Today
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-danger/25 bg-danger/10" /> Missed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-line bg-ink/[0.03]" /> No commitment
        </span>
      </div>
    </div>
  );
}
