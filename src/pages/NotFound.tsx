import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Command,
  Flame,
  LayoutDashboard,
  ListChecks,
  Search,
  Terminal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

const quickLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/streaks", label: "My Streaks", icon: Flame },
  { to: "/accountability", label: "Accountability", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function NotFound() {
  const navigate = useNavigate();
  const { setCommandOpen } = useApp();

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="surface-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              <Terminal className="h-3.5 w-3.5" /> Route not found
            </div>

            <div className="mt-5 flex items-end gap-3">
              <p className="number text-[64px] font-semibold leading-none tracking-tighter text-ink sm:text-[80px]">404</p>
              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-amber/25 bg-amber/[0.06] px-2 py-0.5 text-[9.5px] font-medium text-amber">
                dead end
              </span>
            </div>

            <h1 className="mt-3 text-[19px] font-semibold tracking-tight text-ink">
              This path hasn't been committed yet.
            </h1>
            <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-muted">
              The page you're looking for doesn't exist, moved, or was never verified. Try the
              command palette or head back to familiar ground.
            </p>

            <div className="mt-5 rounded-xl border border-line bg-canvas/80 px-4 py-3 font-mono text-[10.5px] leading-relaxed">
              <p className="text-faint">
                <span className="text-danger">✕</span> GET <span className="text-ink">{typeof window !== "undefined" ? window.location.pathname : "/unknown"}</span>
              </p>
              <p className="mt-1 text-faint">
                <span className="text-amber">!</span> no matching route in router manifest
              </p>
              <p className="mt-1 text-faint">
                <span className="text-accent-bright">→</span> suggestion: check the URL or use search
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button variant="primary" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
              </Button>
              <Button variant="secondary" onClick={() => setCommandOpen(true)}>
                <Search className="h-3.5 w-3.5" /> Search DevStreak
                <span className="ml-1.5 inline-flex items-center gap-0.5 rounded border border-line bg-canvas px-1 py-0.5 font-mono text-[8.5px] text-faint">
                  <Command className="h-2.5 w-2.5" />K
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5 text-[10.5px] font-medium text-muted transition-all hover:-translate-y-px hover:border-muted/40 hover:text-ink hover:shadow-sm"
            >
              <link.icon className="h-3.5 w-3.5 text-faint group-hover:text-accent-bright" />
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
