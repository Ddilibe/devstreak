import type { Person } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

const sizeMap = {
  xs: "h-6 w-6 text-[9.5px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
  xl: "h-16 w-16 text-xl",
};

export function Avatar({
  person,
  name,
  color = "from-slate-400 to-slate-600",
  size = "md",
  className,
  ring = false,
  status,
}: {
  person?: Person;
  name?: string;
  color?: string;
  size?: keyof typeof sizeMap;
  className?: string;
  ring?: boolean;
  status?: "online" | "complete" | "pending";
}) {
  const label = person?.name ?? name ?? "?";
  const gradient = person?.color ?? color;
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-full bg-gradient-to-br font-semibold text-white/95 ring-1 ring-inset ring-white/15",
          gradient,
          sizeMap[size],
          ring && "ring-2 ring-card ring-offset-0",
        )}
        title={label}
      >
        {initials(label)}
      </span>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
            status === "online" && "bg-accent-bright",
            status === "complete" && "bg-accent-bright",
            status === "pending" && "bg-faint",
          )}
        />
      )}
    </span>
  );
}

export function AvatarStack({
  people,
  size = "sm",
  max = 4,
  className,
}: {
  people: Person[];
  size?: keyof typeof sizeMap;
  max?: number;
  className?: string;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <Avatar
          key={p.id}
          person={p}
          size={size}
          ring
          className={i === 0 ? "" : "-ml-2.5"}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "-ml-2.5 grid place-items-center rounded-full border-2 border-card bg-elevated font-mono font-medium text-muted",
            sizeMap[size],
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
