import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Flame,
  LayoutDashboard,
  ListChecks,
  Moon,
  Plug,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Kbd } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const pages = [
  { label: "Overview", hint: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Tasks", hint: "Today's commitments", to: "/tasks", icon: ListChecks },
  { label: "My Streaks", hint: "Personal & group streaks", to: "/streaks", icon: Flame },
  { label: "Accountability", hint: "Partners and groups", to: "/accountability", icon: Users },
  { label: "Activity", hint: "Verified activity timeline", to: "/activity", icon: Activity },
  { label: "Integrations", hint: "Trello, GitHub, Hugging Face", to: "/integrations", icon: Plug },
  { label: "Analytics", hint: "Consistency insights", to: "/analytics", icon: BarChart3 },
  { label: "Settings", hint: "Profile and preferences", to: "/settings", icon: Settings },
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen, theme, toggleTheme } = useApp();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (commandOpen) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [commandOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pages.filter(
      (p) => !q || p.label.toLowerCase().includes(q) || p.hint.toLowerCase().includes(q),
    );
  }, [query]);

  if (!commandOpen) return null;

  const go = (to: string) => {
    setCommandOpen(false);
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[3px] animate-fade-in"
        onClick={() => setCommandOpen(false)}
      />
      <div className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-line bg-card shadow-lift">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter" && results[active]) go(results[active].to);
              if (e.key === "Escape") setCommandOpen(false);
            }}
            placeholder="Search pages, tasks, groups…"
            className="h-14 flex-1 bg-transparent text-[14px] text-ink placeholder:text-faint focus:outline-none"
            aria-label="Command palette search"
          />
          <Kbd>ESC</Kbd>
        </div>

        <div className="max-h-[340px] overflow-y-auto p-2">
          <p className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            Navigate
          </p>
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[12.5px] text-faint">
              No results for “{query}”.
            </p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.to}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(p.to)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                  active === i ? "bg-accent/[0.09]" : "hover:bg-ink/[0.03]",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-md border",
                    active === i
                      ? "border-accent/30 bg-accent/10 text-accent-bright"
                      : "border-line bg-surface text-faint",
                  )}
                >
                  <p.icon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[12.5px] font-medium text-ink">{p.label}</span>
                  <span className="block text-[10.5px] text-faint">{p.hint}</span>
                </span>
                {active === i && <ArrowRight className="h-3.5 w-3.5 text-accent-bright" />}
              </button>
            ))
          )}

          <p className="px-2 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
            Actions
          </p>
          <button
            onClick={() => {
              toggleTheme();
              setCommandOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-ink/[0.03]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md border border-line bg-surface text-faint">
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </span>
            <span className="flex-1 text-[12.5px] font-medium text-ink">
              Switch to {theme === "dark" ? "light" : "dark"} theme
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-line bg-canvas/60 px-4 py-2">
          <span className="text-[10px] text-faint">Navigate with ↑ ↓ · open with ↵</span>
          <span className="flex items-center gap-1 text-[10px] text-faint">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
