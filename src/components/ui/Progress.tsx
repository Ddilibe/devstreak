import { cn } from "@/lib/utils";

const barColors = {
  green: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  amber: "bg-gradient-to-r from-amber-500 to-amber-400",
  blue: "bg-gradient-to-r from-blue-600 to-blue-400",
  violet: "bg-gradient-to-r from-violet-600 to-violet-400",
  neutral: "bg-faint/60",
};

export function Progress({
  value,
  color = "green",
  size = "md",
  className,
  trackClassName,
  showLabel = false,
}: {
  value: number;
  color?: keyof typeof barColors;
  size?: "sm" | "md" | "lg";
  className?: string;
  trackClassName?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-ink/[0.07]",
          size === "sm" && "h-1",
          size === "md" && "h-1.5",
          size === "lg" && "h-2.5",
          trackClassName,
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barColors[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="number shrink-0 text-[11px] font-medium text-muted">{clamped}%</span>
      )}
    </div>
  );
}

export function RingProgress({
  value,
  size = 56,
  stroke = 5,
  color = "rgb(var(--accent-bright))",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--line))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">{children}</span>
    </div>
  );
}
