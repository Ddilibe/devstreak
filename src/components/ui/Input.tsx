import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-line bg-surface text-[13.5px] text-ink placeholder:text-faint transition-colors focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }>(
  function Input({ className, icon, ...props }, ref) {
    if (icon) {
      return (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">{icon}</span>
          <input ref={ref} className={cn(base, "h-10 pl-9 pr-3", className)} {...props} />
        </div>
      );
    }
    return <input ref={ref} className={cn(base, "h-10 px-3", className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(base, "min-h-24 px-3 py-2.5", className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          base,
          "h-10 cursor-pointer appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat px-3 pr-9",
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);

export function Field({
  label,
  hint,
  children,
  className,
  optional,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-ink">{label}</span>
        {optional && <span className="text-[11px] text-faint">Optional</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11.5px] leading-relaxed text-faint">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
}) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full border transition-colors duration-200",
        checked ? "border-accent/40 bg-accent" : "border-line bg-ink/10",
      )}
    >
      <span
        className={cn(
          "inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-[18px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );

  if (!label) return control;

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[13px] font-medium text-ink">{label}</div>
        {description && <div className="mt-0.5 text-[12px] leading-relaxed text-faint">{description}</div>}
      </div>
      {control}
    </div>
  );
}
