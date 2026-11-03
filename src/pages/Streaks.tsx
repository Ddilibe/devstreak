import { useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Info,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Overlay";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { Heatmap } from "@/components/streak/Heatmap";
import { StreakFlame } from "@/components/streak/StreakFlame";
import { useApp } from "@/context/AppContext";
import { currentUser, groups, personById } from "@/lib/data";
import { cn } from "@/lib/utils";

const milestones = [7, 30, 60, 100, 365];

const personalStats = [
  { label: "Longest streak", value: "34", unit: "days", icon: Star, tone: "text-blue" },
  { label: "Successful days", value: "214", unit: "total", icon: CheckCircle2, tone: "text-accent-bright" },
  { label: "Monthly completion", value: "91", unit: "%", icon: CalendarDays, tone: "text-amber" },
  { label: "Grace days used", value: "1", unit: "this month", icon: ShieldCheck, tone: "text-violet" },
];

const consistencyPeriods = [
  { range: "12 Aug – 14 Sep", days: 34, label: "Personal best", tone: "amber" },
  { range: "21 Sep – 12 Oct", days: 22, label: "Second best", tone: "blue" },
  { range: "22 Oct – today", days: 12, label: "Active now", tone: "green" },
];

function MilestoneBurst() {
  const colors = ["bg-amber", "bg-accent-bright", "bg-blue", "bg-violet", "bg-rose-400"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className={cn("absolute h-1.5 w-1.5 rounded-sm animate-confetti", colors[i % colors.length])}
          style={{
            left: `${6 + ((i * 37) % 88)}%`,
            top: "-6px",
            animationDelay: `${(i % 8) * 90}ms`,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function Streaks() {
  const { toast } = useApp();
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const nextMilestone = 30;
  const daysToNext = nextMilestone - currentUser.streak;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Streaks"
        description="Personal and group streaks are calculated independently. One group's outcome never breaks another."
        actions={
          <Button variant="secondary" size="sm" onClick={() => toast({ tone: "success", title: "Streak shared", description: "A public streak card was copied to your clipboard." })}>
            <Sparkles className="h-3.5 w-3.5 text-amber" /> Share streak
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="card relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber/[0.10] blur-[70px]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <StreakFlame size="lg" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
                    Personal streak
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="number text-[44px] font-semibold leading-none tracking-tight text-ink">
                      12
                    </span>
                    <span className="text-[13px] text-muted">days</span>
                    <Badge tone="green" dot className="ml-1 text-[9.5px]">Active</Badge>
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-muted">
                You've shown up for 12 consecutive days. Three of today's five commitments are already
                verified.
              </p>

              <div className="mt-5 max-w-sm">
                <div className="mb-1.5 flex items-center justify-between text-[10.5px]">
                  <span className="text-faint">Next milestone · 30 days</span>
                  <span className="number text-muted">{currentUser.streak}/30</span>
                </div>
                <Progress value={(currentUser.streak / nextMilestone) * 100} color="amber" size="md" />
                <p className="mt-1.5 text-[10px] text-faint">
                  {daysToNext} more verified days to unlock the 30-day milestone.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[210px] sm:grid-cols-1">
              {personalStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-canvas/40 p-2.5">
                  <div className="flex items-center gap-1.5 text-[9.5px] text-faint">
                    <s.icon className={cn("h-3 w-3", s.tone)} />
                    {s.label}
                  </div>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className={cn("number text-lg font-semibold leading-none", s.tone)}>{s.value}</span>
                    <span className="text-[9px] text-faint">{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 border-t border-line-soft pt-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">
                Recent consistency
              </span>
              <span className="text-[9.5px] text-faint">Last 18 weeks · {currentUser.streak}-day active</span>
            </div>
            <Heatmap days={126} />
          </div>
        </div>

        <div className="space-y-4">
          <StreakCalendar />

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-semibold text-ink">Streak milestones</h3>
              <span className="text-[9.5px] text-faint">Tap to celebrate</span>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {milestones.map((m) => {
                const achieved = currentUser.streak >= m;
                return (
                  <button
                    key={m}
                    onClick={() => (achieved ? setCelebrate(m) : toast({ tone: "info", title: `${m}-day milestone locked`, description: `You need ${m - currentUser.streak} more verified days.` }))}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition-colors",
                      achieved
                        ? "border-amber/30 bg-amber/[0.07] hover:bg-amber/[0.12]"
                        : "border-line bg-ink/[0.015] hover:border-faint/40",
                    )}
                    title={achieved ? `Celebrate ${m} days` : `${m} days · locked`}
                  >
                    {achieved ? (
                      <Flame className="h-3.5 w-3.5 text-amber" fill="currentColor" fillOpacity={0.3} />
                    ) : (
                      <Lock className="h-3 w-3 text-faint/60" />
                    )}
                    <span className={cn("number text-[10px]", achieved ? "font-semibold text-amber" : "text-faint")}>
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-[9.5px] leading-relaxed text-faint">
              7 days unlocked · next at {nextMilestone}. Milestones are personal and never affect group qualification.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <SectionHeader
            title="Streak history"
            description="Every day, honestly recorded. Gray days had no commitment scheduled."
          />
          <div className="mt-4">
            <Heatmap days={126} />
          </div>
          <div className="mt-4 grid gap-2 border-t border-line-soft pt-4 sm:grid-cols-3">
            {consistencyPeriods.map((p) => (
              <div key={p.range} className="rounded-lg border border-line bg-canvas/40 px-2.5 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] text-faint">{p.label}</span>
                  <span className="number text-[10px] font-semibold text-ink">{p.days}d</span>
                </div>
                <p className="mt-0.5 font-mono text-[9.5px] text-muted">{p.range}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <SectionHeader title="Why streaks count" description="The rules behind the flame" />
          <div className="mt-3 space-y-3 text-[10.5px] leading-relaxed">
            {[
              {
                title: "A day counts when criteria are met",
                copy: "Not when a task is checked off. Qualifying coding activity must satisfy your evidence rule.",
              },
              {
                title: "Source sync is not completion",
                copy: "Trello status changes are mirrored instantly but never counted as verified progress.",
              },
              {
                title: "Missed days are recoverable",
                copy: "A single miss resets the current streak, but longest streak and total days remain.",
              },
              {
                title: "Group streaks are isolated",
                copy: "Each group has its own policy, timezone and grace period. Failures never cascade.",
              },
            ].map((r) => (
              <div key={r.title} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
                <div>
                  <p className="font-medium text-ink">{r.title}</p>
                  <p className="mt-0.5 text-faint">{r.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title={
            <span className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-faint" /> Accountability streaks
              <Badge tone="neutral" className="text-[9.5px]">{groups.length} groups</Badge>
            </span>
          }
          description="Every group is evaluated independently against its own qualification policy."
          action={
            <Link
              to="/accountability"
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
            >
              Manage groups <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {groups.map((g) => {
            const members = g.memberIds.map(personById);
            const last14 = g.history.slice(-21);
            return (
              <div key={g.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-lg">
                        {g.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-[13.5px] font-semibold text-ink">{g.name}</h3>
                          <Badge tone={g.policy === "All members" ? "blue" : "violet"} className="text-[8.5px]">
                            {g.policy}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-[10px] text-faint">
                          {g.timezone} · {g.gracePeriod}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/accountability/${g.id}`}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line text-faint transition-colors hover:bg-ink/5 hover:text-ink"
                      aria-label={`View ${g.name}`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-amber/20 bg-amber/[0.04] px-2.5 py-2">
                      <p className="text-[9px] uppercase tracking-wider text-faint">Current</p>
                      <p className="number mt-0.5 flex items-baseline gap-1 text-lg font-semibold text-amber">
                        <Flame className="h-3.5 w-3.5" fill="currentColor" fillOpacity={0.25} />
                        {g.streak}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-canvas/40 px-2.5 py-2">
                      <p className="text-[9px] uppercase tracking-wider text-faint">Longest</p>
                      <p className="number mt-0.5 text-lg font-semibold text-ink">{g.longest}</p>
                    </div>
                    <div className="rounded-lg border border-line bg-canvas/40 px-2.5 py-2">
                      <p className="text-[9px] uppercase tracking-wider text-faint">Completion</p>
                      <p className="number mt-0.5 text-lg font-semibold text-accent-bright">{g.rate}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-faint">
                      <span>Historical qualification</span>
                      <span>last 21 days</span>
                    </div>
                    <div className="flex gap-1">
                      {last14.map((h) => (
                        <span
                          key={h.date}
                          title={`${format(parseISO(h.date), "d MMM")} · ${h.result}`}
                          className={cn(
                            "h-5 flex-1 rounded-[3px] border",
                            h.result === "qualified" && "border-accent/20 bg-accent/40",
                            h.result === "grace" && "border-amber/20 bg-amber/35",
                            h.result === "missed" && "border-danger/20 bg-danger/30",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-line-soft pt-3">
                    <div className="flex -space-x-2">
                      {members.map((m) => (
                        <Avatar key={m.id} person={m} size="sm" ring />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {g.todayQualified ? (
                        <Badge tone="green" dot className="text-[9.5px]">Qualified today</Badge>
                      ) : (
                        <Badge tone="amber" dot className="text-[9.5px]">Pending today</Badge>
                      )}
                      <span className="number text-[10.5px] text-faint">{g.memberDone}/{g.memberTotal}</span>
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed text-faint">{g.qualificationNote}</p>
                </div>
              </div>
            );
          })}
          <div className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-line bg-ink/[0.015] p-5">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-faint">
              <Users className="h-4 w-4" />
            </span>
            <h3 className="mt-3 text-[13px] font-semibold text-ink">Start another group</h3>
            <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-muted">
              You can be part of as many independent accountability groups as you like. Each one gets
              its own streak, policy and timezone.
            </p>
            <Link to="/accountability" className="mt-3">
              <Button variant="outline" size="sm">
                Create a group <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-line bg-surface/50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-medium text-ink">How group qualification works:</span> each group's
          streak is evaluated at its own local midnight. A missed day in Night Owls has no effect on
          Ship It Squad. Grace days are consumed automatically and shown in group history.
        </p>
      </div>

      <Modal
        open={celebrate !== null}
        onClose={() => setCelebrate(null)}
        title="Milestone unlocked"
        description="A moment worth protecting."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCelebrate(null)}>Keep going</Button>
            <Button
              variant="primary"
              onClick={() => {
                toast({ tone: "success", title: "Milestone shared", description: "Your streak card was copied to the clipboard." });
                setCelebrate(null);
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Share milestone
            </Button>
          </>
        }
      >
        <div className="relative py-4 text-center">
          <MilestoneBurst />
          <div className="relative">
            <StreakFlame size="lg" className="mx-auto h-16 w-16" />
            <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
              {celebrate}-day streak
            </p>
            <h3 className="mt-1 text-[24px] font-bold tracking-tight text-ink">Consistency compounds.</h3>
            <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-muted">
              You've verified coding activity for {celebrate} consecutive days. That's {celebrate} days
              of keeping a promise to yourself — and to your partners.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "This streak", value: `${currentUser.streak}d` },
                { label: "Personal best", value: "34d" },
                { label: "Completion", value: "91%" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-line bg-canvas/50 px-2 py-2">
                  <p className="number text-sm font-semibold text-ink">{s.value}</p>
                  <p className="text-[9px] text-faint">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-faint">
              <Trophy className="h-3 w-3 text-amber" /> Next milestone: 30 days
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
