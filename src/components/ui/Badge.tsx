import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "green" | "blue" | "amber" | "red" | "violet" | "neutral" | "outline";

const tones: Record<Tone, string> = {
  green: "bg-accent/10 text-accent-bright border-accent/25",
  blue: "bg-blue/10 text-blue border-blue/25",
  amber: "bg-amber/10 text-amber border-amber/25",
  red: "bg-danger/10 text-danger border-danger/25",
  violet: "bg-violet/10 text-violet border-violet/25",
  neutral: "bg-ink/[0.05] text-muted border-line",
  outline: "bg-transparent text-muted border-line",
};

const dots: Record<Tone, string> = {
  green: "bg-accent-bright",
  blue: "bg-blue",
  amber: "bg-amber",
  red: "bg-danger",
  violet: "bg-violet",
  neutral: "bg-faint",
  outline: "bg-faint",
};

export function Badge({
  tone = "neutral",
  dot,
  pulse,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone], pulse && "animate-pulse-dot")} />
      )}
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[5px] border border-line bg-ink/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
      {children}
    </kbd>
  );
}
