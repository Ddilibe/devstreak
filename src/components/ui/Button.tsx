import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "soft";
type Size = "xs" | "sm" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_6px_20px_-8px_rgba(22,163,74,0.65)] hover:bg-accent-bright active:translate-y-px",
  secondary:
    "bg-elevated text-ink border border-line hover:border-faint/50 hover:bg-card active:translate-y-px",
  ghost: "text-muted hover:text-ink hover:bg-ink/[0.05] active:translate-y-px",
  outline:
    "border border-line bg-transparent text-ink hover:border-faint/60 hover:bg-ink/[0.03] active:translate-y-px",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/15 active:translate-y-px",
  soft: "bg-accent/10 text-accent-bright border border-accent/20 hover:bg-accent/15",
};

const sizes: Record<Size, string> = {
  xs: "h-7 px-2.5 text-[12px] gap-1.5 rounded-lg",
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-[13.5px] gap-2 rounded-xl",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
  "icon-sm": "h-8 w-8 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", loading, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});
