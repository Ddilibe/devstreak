import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: { value: T; label: React.ReactNode; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-line bg-ink/[0.03] p-0.5",
        className,
      )}
      role="tablist"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[9px] font-medium transition-all duration-150",
            size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[12.5px]",
            value === opt.value
              ? "bg-elevated text-ink shadow-sm ring-1 ring-line"
              : "text-muted hover:text-ink",
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span
              className={cn(
                "number rounded-full px-1.5 text-[10px] leading-4",
                value === opt.value ? "bg-ink/[0.07] text-muted" : "text-faint",
              )}
            >
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
