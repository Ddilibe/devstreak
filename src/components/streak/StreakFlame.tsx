import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakFlame({
  size = "md",
  className,
  animate = true,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-xl border border-amber/25 bg-gradient-to-br from-amber/15 via-amber/[0.06] to-transparent text-amber",
        size === "sm" && "h-8 w-8",
        size === "md" && "h-11 w-11",
        size === "lg" && "h-14 w-14 rounded-2xl",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-[inherit] bg-amber/20 blur-xl opacity-40" />
      <Flame
        className={cn(
          "relative",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-7 w-7",
          animate && "animate-flame-flicker",
        )}
        strokeWidth={2.1}
        fill="currentColor"
        fillOpacity={0.15}
      />
      {size === "lg" && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent-bright" />
      )}
    </span>
  );
}
