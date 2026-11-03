import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  breadcrumb,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-[11.5px] text-faint">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link to={crumb.href} className="transition-colors hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-muted">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-bright">
            {eyebrow}
          </div>
        )}
        <h1 className="truncate text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-[14px] font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[12px] text-faint">{description}</p>}
      </div>
      {action}
    </div>
  );
}
