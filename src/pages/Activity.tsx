import { useMemo, useState } from "react";
import { format, isAfter, isToday, isYesterday, parseISO, subDays } from "date-fns";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  GitBranch,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { ActivityRow } from "@/components/activity/ActivityRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/context/AppContext";
import { activities, people, personById } from "@/lib/data";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeOptions = [
  { value: "all", label: "All activity types" },
  { value: "commit", label: "Commits" },
  { value: "pull_request", label: "Pull requests" },
  { value: "merge", label: "Merges" },
  { value: "review", label: "Reviews" },
  { value: "repo_update", label: "Repository updates" },
  { value: "sync", label: "Task synchronization" },
  { value: "verified", label: "Commitment verified" },
  { value: "partner", label: "Partner progress" },
  { value: "milestone", label: "Milestones" },
  { value: "discussion", label: "Discussions" },
];

export function Activity() {
  const { toast } = useApp();
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [type, setType] = useState("all");
  const [actor, setActor] = useState("all");
  const [range, setRange] = useState("7");
  const [verified, setVerified] = useState<"all" | "verified" | "pending">("all");
  const [syncWarning, setSyncWarning] = useState(true);

  const filtered = useMemo(() => {
    const cutoff = subDays(new Date(), Number(range));
    return activities
      .filter((a) => isAfter(parseISO(a.time), cutoff))
      .filter((a) => platform === "all" || a.platform === platform)
      .filter((a) => type === "all" || a.type === type)
      .filter((a) => actor === "all" || a.actorId === actor)
      .filter((a) => verified === "all" || a.verified === verified)
      .sort((a, b) => +new Date(b.time) - +new Date(a.time));
  }, [platform, type, actor, range, verified]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((a) => {
      const key = format(parseISO(a.time), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), a]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const hasFilters = platform !== "all" || type !== "all" || actor !== "all" || verified !== "all" || range !== "7";
  const pending = activities.filter((a) => a.verified === "pending").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Activity"
        description="Every signal DevStreak observes, in chronological order. Evidence is labeled — it's never confused with completion."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast({ tone: "success", title: "Export prepared", description: "A CSV of this activity view was generated." })}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      {syncWarning && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber/30 bg-amber/[0.05] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-amber/10 text-amber">
              <RefreshCw className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-[11.5px] font-medium text-ink">Hugging Face synchronization is delayed</p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
                Last successful sync was 11 minutes ago — outside the expected 5-minute window.
                Verification continues with cached data.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setSyncWarning(false);
                toast({ tone: "success", title: "Sync retried", description: "Hugging Face connected. New activity will appear shortly." });
              }}
            >
              Retry
            </Button>
            <button
              onClick={() => setSyncWarning(false)}
              aria-label="Dismiss warning"
              className="grid h-7 w-7 place-items-center rounded-md text-faint hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Signals captured", value: activities.length, icon: ActivityIcon, tone: "text-ink" },
          { label: "Commitments verified", value: activities.filter((a) => a.type === "verified").length, icon: ShieldCheck, tone: "text-accent-bright" },
          { label: "Awaiting verification", value: pending, icon: Clock, tone: "text-amber" },
          { label: "Contributors", value: new Set(activities.map((a) => a.actorId)).size, icon: Users, tone: "text-blue" },
        ].map((s) => (
          <div key={s.label} className="card px-3.5 py-3">
            <div className="flex items-center justify-between">
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-faint">{s.label}</p>
              <s.icon className={cn("h-3.5 w-3.5", s.tone)} />
            </div>
            <p className={cn("number mt-1.5 text-xl font-semibold", s.tone)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <div className="card p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-1 text-[10.5px] font-medium text-faint">
                <Filter className="h-3 w-3" /> Filters
              </span>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value as Platform | "all")} className="h-8 w-auto min-w-[120px] text-[11px]">
                <option value="all">All platforms</option>
                <option value="github">GitHub</option>
                <option value="trello">Trello</option>
                <option value="huggingface">Hugging Face</option>
                <option value="manual">Manual</option>
              </Select>
              <Select value={type} onChange={(e) => setType(e.target.value)} className="h-8 w-auto min-w-[140px] text-[11px]">
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
              <Select value={actor} onChange={(e) => setActor(e.target.value)} className="h-8 w-auto min-w-[120px] text-[11px]">
                <option value="all">All users</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
              <Select value={range} onChange={(e) => setRange(e.target.value)} className="h-8 w-auto min-w-[110px] text-[11px]">
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setPlatform("all");
                    setType("all");
                    setActor("all");
                    setRange("7");
                    setVerified("all");
                  }}
                >
                  <X className="h-3 w-3" /> Reset
                </Button>
              )}
              <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-line bg-ink/[0.02] p-0.5">
                {(
                  [
                    { v: "all", label: "All" },
                    { v: "verified", label: "Verified" },
                    { v: "pending", label: "Pending" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setVerified(o.v)}
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                      verified === o.v ? "bg-elevated text-ink shadow-sm" : "text-faint hover:text-muted",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {groups.length === 0 ? (
            <EmptyState
              icon={ActivityIcon}
              title="No activity in this range"
              description="Try widening the date range or removing filters. DevStreak only shows signals that actually occurred."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPlatform("all");
                    setType("all");
                    setActor("all");
                    setRange("30");
                    setVerified("all");
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {groups.map(([key, events]) => {
                const date = parseISO(key);
                const label = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "EEEE, d MMMM");
                return (
                  <div key={key} className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-line-soft bg-canvas/35 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-ink">{label}</span>
                        <span className="font-mono text-[9.5px] text-faint">{format(date, "d MMM yyyy")}</span>
                      </div>
                      <Badge tone="neutral" className="text-[9px]">{events.length} events</Badge>
                    </div>
                    <div className="divide-y divide-line-soft px-4">
                      {events.map((a) => (
                        <ActivityRow key={a.id} event={a} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card p-4">
            <SectionHeader title="Verification funnel" description="How today's signals translate into proof" />
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Tasks synchronized", value: 7, total: 7, color: "bg-blue/60" },
                { label: "Coding evidence detected", value: 5, total: 7, color: "bg-violet/60" },
                { label: "Commitments verified", value: 3, total: 7, color: "bg-accent-bright/70" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="text-muted">{row.label}</span>
                    <span className="number text-faint">{row.value}/{row.total}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                    <div className={cn("h-full rounded-full", row.color)} style={{ width: `${(row.value / row.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-canvas/40 px-2.5 py-2">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-accent-bright" />
              <p className="text-[9.5px] leading-relaxed text-faint">
                Sync does not imply evidence. Evidence does not imply completion. Only verified
                commitments extend your streak.
              </p>
            </div>
          </div>

          <div className="card p-4">
            <SectionHeader title="By platform" description="Signals observed in the last 7 days" />
            <div className="mt-3 space-y-2">
              {[
                { name: "GitHub", count: activities.filter((a) => a.platform === "github").length, color: "bg-accent-bright/70", icon: <GitBranch className="h-3.5 w-3.5" /> },
                { name: "Trello", count: activities.filter((a) => a.platform === "trello").length, color: "bg-blue/60", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                { name: "Hugging Face", count: activities.filter((a) => a.platform === "huggingface").length, color: "bg-amber/60", icon: <ActivityIcon className="h-3.5 w-3.5" /> },
              ].map((p) => {
                const max = Math.max(...[6, 2, 4]);
                return (
                  <div key={p.name} className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-md border border-line bg-canvas text-faint">{p.icon}</span>
                    <span className="w-20 text-[10px] text-muted">{p.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                      <div className={cn("h-full rounded-full", p.color)} style={{ width: `${(p.count / max) * 100}%` }} />
                    </div>
                    <span className="number w-4 text-right text-[10px] text-faint">{p.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-4">
            <SectionHeader title="People in this view" description="Contributors and partners" />
            <div className="mt-3 space-y-2">
              {Array.from(new Set(activities.map((a) => a.actorId))).slice(0, 5).map((id) => {
                const p = personById(id);
                const count = activities.filter((a) => a.actorId === id).length;
                return (
                  <button
                    key={id}
                    onClick={() => setActor(actor === id ? "all" : id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-ink/[0.03]",
                      actor === id && "bg-accent/[0.05]",
                    )}
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-[8px] font-bold text-white">
                      {p.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <span className="flex-1 truncate text-[10.5px] text-muted">{p.name}</span>
                    <span className="number text-[9.5px] text-faint">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/60 px-3.5 py-3">
            <SlidersHorizontal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
            <p className="text-[10px] leading-relaxed text-faint">
              Activity retention is 18 months. Verified evidence is immutable; manual edits are
              logged and never replace source events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
