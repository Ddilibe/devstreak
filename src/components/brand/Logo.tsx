import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-[10px] bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_4px_18px_-6px_rgba(34,197,94,0.65)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]">
        <path
          d="M8 17.5 12.8 12 8 6.5"
          stroke="#07130C"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 17.5h4" stroke="#07130C" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18.5" cy="6.5" r="2" fill="#FDE68A" />
      </svg>
    </span>
  );
}

export function Logo({
  compact = false,
  className,
  markClassName,
}: {
  compact?: boolean;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8", markClassName)} />
      {!compact && (
        <span className="flex items-baseline gap-0.5">
          <span className="text-[17px] font-bold tracking-tight text-ink">DevStreak</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
        </span>
      )}
    </span>
  );
}
