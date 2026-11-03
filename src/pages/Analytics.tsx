import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  Clock,
  Download,
  Flame,
  GitCommitHorizontal,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Segmented } from "@/components/ui/Segmented";
import { Heatmap } from "@/components/streak/Heatmap";
import { useApp } from "@/context/AppContext";
import {
  currentUser,
  dayOfWeek,
  generateHeat,
  groups,
  projectBreakdown,
  streakTrend,
  weeklyCompletion,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "rgb(var(--card))",
  border: "1px solid rgb(var(--line))",
  borderRadius: 10,
  fontSize: 11,
  padding: "8px 10px",
  boxShadow: "0 8px 24px rgb(0 0 0 / 0.18)",
  color: "rgb(var(--ink))",
};

const axisTick = { fontSize: 10, fill: "rgb(var(--faint))" };

type Range = "7" | "30" | "90";

function rateOf(days: ReturnType<typeof generateHeat>) {
  if (!days.length) return 0;
  return Math.round((days.filter((d) => d.status === "complete").length / days.length) * 100);
}

function Kpi({
  label,
  value,
  suffix,
  delta,
  icon: Icon,
  tone,
  spark,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  delta: number;
  icon: LucideIcon;
  tone: string;
  spark: number[];
}) {
  const positive = delta >= 0;
  const max = Math.max(...spark, 1);
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-faint">{label}</p>
        <Icon className={cn("h-3.5 w-3.5 shrink-0", tone)} />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="number text-[22px] font-semibold leading-none text-ink">
          {value}
          {suffix && <span className="ml-0.5 text-[11px] font-medium text-faint">{suffix}</span>}
        </p>
        <div className="flex h-6 items-end gap-[2px]">
          {spark.map((v, i) => (
            <span
              key={i}
              className={cn("w-[3px] rounded-sm", positive ? "bg-accent-bright/50" : "bg-danger/35")}
              style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[9.5px] font-semibold",
            positive ? "text-accent-bright" : "text-danger",
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {positive ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
        <span className="text-[9px] text-faint">vs previous period</span>
      </div>
    </div>
  );
}

export function Analytics() {
  const { toast, tasks } = useApp();
  const [range, setRange] = useState<Range>("30");

  const days = Number(range);

  const { buckets, kpis, previous } = useMemo(() => {
    const heat = generateHeat(days);
    const elapsed = heat.filter((d) => d.status !== "upcoming");
    const bucketSize = days === 7 ? 1 : 7;
    const buckets = [] as {
      label: string;
      commits: number;
      rate: number;
      minutes: number;
      complete: number;
      total: number;
    }[];

    for (let i = 0; i < elapsed.length; i += bucketSize) {
      const slice = elapsed.slice(i, i + bucketSize);
      const commits = slice.reduce((s, d) => s + d.commits, 0);
      const minutes = slice.reduce((s, d) => s + d.minutes, 0);
      const complete = slice.filter((d) => d.status === "complete").length;
      buckets.push({
        label: format(slice[0].date, days === 7 ? "EEE" : "d MMM"),
        commits,
        minutes,
        complete,
        total: slice.length,
        rate: Math.round((complete / slice.length) * 100),
      });
    }

    const prevHeat = generateHeat(days * 2).slice(0, days);
    const prev = prevHeat.filter((d) => d.status !== "upcoming");
    const prevCommits = prev.reduce((s, d) => s + d.commits, 0);
    const prevMinutes = prev.reduce((s, d) => s + d.minutes, 0);
    const commits = elapsed.reduce((s, d) => s + d.commits, 0);
    const minutes = elapsed.reduce((s, d) => s + d.minutes, 0);
    const complete = elapsed.filter((d) => d.status === "complete").length;
    const rate = rateOf(elapsed);
    const prevRate = rateOf(prev);

    const pct = (next: number, before: number) =>
      before === 0 ? 0 : ((next - before) / before) * 100;

    return {
      buckets,
      previous: { rate: prevRate, commits: prevCommits, minutes: prevMinutes, complete: prev.length },
      kpis: {
        rate,
        commits,
        minutes,
        complete,
        elapsed: elapsed.length,
        rateDelta: rate - prevRate,
        commitsDelta: pct(commits, prevCommits),
        minutesDelta: pct(minutes, prevMinutes),
        completeDelta: pct(complete, Math.max(1, Math.round((prev.length * prevRate) / 100))),
      },
    };
  }, [days]);

  const projectTotal = projectBreakdown.reduce((s, p) => s + p.commits, 0);
  const weekly = days === 7 ? weeklyCompletion.slice(-4) : days === 30 ? weeklyCompletion.slice(-8) : weeklyCompletion;
  const verifiedTasks = tasks.filter((t) => t.status === "verified").length;
  const evidenceCoverage = 92;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        description="Outcomes, not optics. See what actually shipped, where consistency breaks, and how evidence supports every verified day."
        actions={
          <>
            <Segmented
              size="sm"
              value={range}
              onChange={setRange}
              options={[
                { value: "7", label: "7d" },
                { value: "30", label: "30d" },
                { value: "90", label: "90d" },
              ]}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ tone: "success", title: "Report exported", description: `A ${days}-day analytics report was generated.` })}
            >
              <Download className="h-3.5 w-3.5" /> Export report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
        <Kpi
          label="Completion rate"
          value={kpis.rate}
          suffix="%"
          delta={kpis.rateDelta}
          icon={CalendarCheck}
          tone="text-accent-bright"
          spark={buckets.map((b) => b.rate)}
        />
        <Kpi
          label="Current streak"
          value={currentUser.streak}
          suffix="days"
          delta={8.3}
          icon={Flame}
          tone="text-amber"
          spark={[5, 6, 7, 7, 9, 10, 12]}
        />
        <Kpi
          label="Verified tasks"
          value={verifiedTasks}
          delta={kpis.completeDelta}
          icon={ShieldCheck}
          tone="text-blue"
          spark={[1, 1, 2, 1, 2, 2, 2]}
        />
        <Kpi
          label="Commits shipped"
          value={kpis.commits}
          delta={kpis.commitsDelta}
          icon={GitCommitHorizontal}
          tone="text-violet"
          spark={buckets.map((b) => b.commits)}
        />
        <Kpi
          label="Focus time"
          value={(kpis.minutes / 60).toFixed(0)}
          suffix="hrs"
          delta={kpis.minutesDelta}
          icon={Clock}
          tone="text-faint"
          spark={buckets.map((b) => b.minutes)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeader
              title="Coding output & completion"
              description={`${days} days · ${buckets.length} ${days === 7 ? "daily" : "weekly"} buckets`}
            />
            <div className="flex items-center gap-3 text-[9.5px] text-faint">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-accent-bright/70" /> Commits
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-amber" /> Completion %
              </span>
            </div>
          </div>
          <div className="mt-5 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={buckets} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line) / 0.5)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} dy={6} />
                <YAxis yAxisId="left" tick={axisTick} axisLine={false} tickLine={false} width={40} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} width={32} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgb(var(--ink) / 0.03)" }}
                  formatter={(value: number, name: string) => [name === "rate" ? `${value}%` : value, name === "rate" ? "Completion" : "Commits"]}
                />
                <Bar yAxisId="left" dataKey="commits" fill="rgb(34 197 94 / 0.55)" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="rgb(245 158 11)" strokeWidth={1.75} dot={false} activeDot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col p-4 sm:p-5">
          <SectionHeader title="What stands out" description="Patterns from this period" />
          <div className="mt-4 flex-1 space-y-2.5">
            {[
              {
                icon: TrendingUp,
                tone: "text-accent-bright",
                title: "Momentum is improving",
                body: `Completion is ${kpis.rateDelta >= 0 ? "up" : "down"} ${Math.abs(kpis.rateDelta).toFixed(1)} points versus the previous ${days}-day period.`,
                badge: kpis.rateDelta >= 0 ? "Improving" : "Slipping",
              },
              {
                icon: TrendingDown,
                tone: "text-amber",
                title: "Fridays remain the weak point",
                body: "Friday completion averages 79%, 15 points below Monday. Two of three missed commitments land after 17:00.",
                badge: "Weekday",
              },
              {
                icon: ShieldCheck,
                tone: "text-violet",
                title: "Evidence coverage is strong",
                body: `${evidenceCoverage}% of verified commitments have linked repository activity. The rest rely on manual review.`,
                badge: "92%",
              },
              {
                icon: Clock,
                tone: "text-blue",
                title: "Deep work happens early",
                body: "54% of qualified commits land between 09:00 and 12:00. Evenings produce more reviews but fewer shipped commits.",
                badge: "Morning",
              },
            ].map((insight) => (
              <div key={insight.title} className="rounded-xl border border-line bg-canvas/35 p-3">
                <div className="flex items-center gap-2">
                  <insight.icon className={cn("h-3.5 w-3.5", insight.tone)} />
                  <p className="flex-1 text-[11.5px] font-medium text-ink">{insight.title}</p>
                  <Badge tone="neutral" className="text-[8.5px]">{insight.badge}</Badge>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">{insight.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/[0.04] px-2.5 py-2">
            <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-accent-bright" />
            <p className="text-[9.5px] leading-relaxed text-faint">
              Suggestion: set Friday's commitment to one review-sized task. Smaller verified work
              protects the streak without inflating proof.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 sm:p-5">
          <SectionHeader title="Project distribution" description="Commit volume · last 12 weeks" />
          <div className="relative mt-2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectBreakdown}
                  dataKey="commits"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={74}
                  paddingAngle={3}
                  stroke="none"
                >
                  {projectBreakdown.map((p) => (
                    <Cell key={p.name} fill={p.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} commits`, "Volume"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="number text-xl font-semibold text-ink">{projectTotal}</p>
              <p className="text-[9px] uppercase tracking-wider text-faint">commits</p>
            </div>
          </div>
          <div className="mt-1 space-y-2">
            {projectBreakdown.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="min-w-0 flex-1 truncate font-mono text-[9.5px] text-muted">{p.name}</span>
                <span className="number text-[9.5px] text-faint">{Math.round((p.commits / projectTotal) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <SectionHeader title="Consistency by weekday" description="Completion rate, last 90 days" />
          <div className="mt-4 h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeek} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line) / 0.5)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} dy={6} />
                <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} width={36} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--ink) / 0.03)" }} formatter={(v: number) => [`${v}%`, "Completion"]} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {dayOfWeek.map((d) => (
                    <Cell key={d.day} fill={d.rate >= 90 ? "rgb(34 197 94 / 0.7)" : d.rate >= 80 ? "rgb(59 130 246 / 0.6)" : "rgb(245 158 11 / 0.55)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-[9.5px] text-faint">
            <span>Best: Tuesday · 88%</span>
            <span className="text-amber">Weakest: Saturday · 62%</span>
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <SectionHeader title="Streak trend" description="Personal vs group accountability" />
          <div className="mt-4 h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streakTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid stroke="rgb(var(--line) / 0.5)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} dy={6} interval={2} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="personal" name="Personal" stroke="rgb(34 197 94)" strokeWidth={1.75} dot={false} />
                <Line type="monotone" dataKey="accountability" name="Accountability" stroke="rgb(139 92 246)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-[9.5px] text-faint">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-accent-bright" /> Personal
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-violet" /> Accountability
            </span>
            <span className="ml-auto text-accent-bright">Personal streak leads</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="card p-4 sm:p-5">
          <SectionHeader
            title="Consistency map"
            description="126 days of verified activity"
            action={<Badge tone="green" dot className="text-[9px]">94% consistency</Badge>}
          />
          <Heatmap className="mt-4" days={126} />
          <div className="mt-4 grid grid-cols-3 divide-x divide-line-soft border-t border-line-soft pt-3">
            {[
              { label: "Complete days", value: "118" },
              { label: "Longest streak", value: "41d" },
              { label: "Grace used", value: "3" },
            ].map((s, i) => (
              <div key={s.label} className={cn(i === 0 ? "pr-3" : "px-3", "min-w-0")}>
                <p className="truncate text-[9px] uppercase tracking-wider text-faint">{s.label}</p>
                <p className="number mt-0.5 text-[13px] font-semibold text-ink">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <SectionHeader title="Accountability groups" description="Current 30-day qualification" action={<Trophy className="h-4 w-4 text-amber" />} />
          <div className="mt-4 space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="rounded-xl border border-line bg-canvas/35 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{g.emoji}</span>
                  <p className="flex-1 truncate text-[11.5px] font-medium text-ink">{g.name}</p>
                  <Badge tone={g.rate >= 90 ? "green" : "amber"} className="text-[8.5px]">{g.rate}%</Badge>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                  <div
                    className={cn("h-full rounded-full", g.rate >= 90 ? "bg-accent-bright/70" : "bg-amber/60")}
                    style={{ width: `${g.rate}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[9px] text-faint">
                  <span>{g.memberTotal} members · {g.policy}</span>
                  <span className="number">{g.streak}d streak</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-violet/20 bg-violet/[0.04] px-2.5 py-2">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-violet" />
            <p className="text-[9.5px] leading-relaxed text-faint">
              Group streaks qualify independently. Join an accountability group to protect the
              days when solo motivation is lowest.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: GitCommitHorizontal, label: "Commits this period", value: kpis.commits, note: `${previous.commits} last period` },
          { icon: CalendarCheck, label: "Verified days", value: `${kpis.complete}/${kpis.elapsed}`, note: `${kpis.rate}% completion` },
          { icon: BarChart3, label: "Weekly trend", value: `${weekly[weekly.length - 1]?.rate ?? 0}%`, note: "latest week rate" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-line bg-card px-3.5 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-canvas text-faint">
              <s.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[9.5px] uppercase tracking-wider text-faint">{s.label}</p>
              <p className="number mt-0.5 text-[14px] font-semibold text-ink">{s.value}</p>
            </div>
            <span className="ml-auto hidden text-[9px] text-faint sm:block">{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
