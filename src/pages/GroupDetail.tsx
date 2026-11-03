import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Flame,
  Info,
  Link2,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress, RingProgress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActivityRow } from "@/components/activity/ActivityRow";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { useApp } from "@/context/AppContext";
import { activities, groups, personById } from "@/lib/data";
import type { Group } from "@/lib/types";
import { cn } from "@/lib/utils";

const syntheticCommitments: Record<string, { done: string[]; pending: string[] }> = {
  mira: {
    done: ["Ship command palette", "Review PR #284", "Fix type regression", "Update changelog"],
    pending: [],
  },
  jonas: {
    done: ["Rotate staging credentials", "Patch billing webhook"],
    pending: ["Add idempotency tests", "Document retry policy"],
  },
  priya: {
    done: ["Publish model card", "Evaluation notebook", "Reply to discussion"],
    pending: [],
  },
  alex: {
    done: ["Fix checkout test", "Polish empty states", "Onboarding review"],
    pending: ["Token refresh middleware", "Document streak logic"],
  },
  sam: {
    done: [],
    pending: ["Billing events refactor", "Add usage metrics", "Review migration plan"],
  },
  lena: {
    done: ["Date picker a11y fixes"],
    pending: ["Publish design tokens", "Write migration notes"],
  },
  diego: {
    done: ["Open command palette PR", "Fix icon sizing"],
    pending: [],
  },
};

function GroupCalendar({ group }: { group: Group }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leading = (getDay(startOfMonth(month)) + 6) % 7;
  const historyByKey = new Map(group.history.map((h) => [h.date, h]));
  const selectedKey = format(selected, "yyyy-MM-dd");
  const selectedRecord = historyByKey.get(selectedKey);
  const today = new Date();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[12.5px] font-semibold text-ink">Group calendar</h3>
          <p className="text-[9.5px] text-faint">Qualification history</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonth(subMonths(month, 1))}
            className="grid h-6 w-6 place-items-center rounded border border-line text-faint hover:bg-ink/5 hover:text-ink"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="min-w-[74px] text-center text-[10.5px] font-medium text-muted">
            {format(month, "MMM yyyy")}
          </span>
          <button
            onClick={() => setMonth(addMonths(month, 1))}
            className="grid h-6 w-6 place-items-center rounded border border-line text-faint hover:bg-ink/5 hover:text-ink"
            aria-label="Next month"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="pb-0.5 text-center font-mono text-[9px] text-faint">{d}</div>
        ))}
        {Array.from({ length: leading }).map((_, i) => (
          <div key={`b-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const rec = historyByKey.get(key);
          const future = day > today && !isSameDay(day, today);
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selected);
          return (
            <button
              key={key}
              onClick={() => setSelected(day)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-md border text-[10px] transition-colors",
                rec?.result === "qualified" && "border-accent/25 bg-accent/[0.11] text-accent-bright hover:bg-accent/[0.18]",
                rec?.result === "grace" && "border-amber/25 bg-amber/[0.08] text-amber",
                rec?.result === "missed" && "border-danger/25 bg-danger/[0.08] text-danger",
                !rec && !future && !isToday && "border-line bg-ink/[0.02] text-faint",
                !rec && future && "border-dashed border-line/60 text-faint/60",
                isToday && "border-amber/60 ring-1 ring-amber/40",
                isSelected && "ring-2 ring-ink/30 ring-offset-1 ring-offset-card",
              )}
              title={`${format(day, "d MMM")}${rec ? ` · ${rec.result}` : ""}`}
            >
              <span className="number">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-line-soft pt-2.5 text-[9px] text-faint">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-accent/30" /> Qualified</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-amber/30" /> Grace</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-danger/30" /> Missed</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] border border-amber/50" /> Today</span>
      </div>

      <div className="mt-3 rounded-lg border border-line bg-canvas/50 p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-ink">{format(selected, "d MMMM")}</span>
          {selectedRecord ? (
            <Badge
              tone={selectedRecord.result === "qualified" ? "green" : selectedRecord.result === "grace" ? "amber" : "red"}
              dot
              className="text-[8.5px]"
            >
              {selectedRecord.result === "qualified" ? "Qualified" : selectedRecord.result === "grace" ? "Grace used" : "Missed"}
            </Badge>
          ) : (
            <span className="text-[9px] text-faint">{isSameDay(selected, today) ? "In progress" : "No record"}</span>
          )}
        </div>
        <p className="mt-1 text-[9.5px] leading-relaxed text-faint">
          {selectedRecord?.result === "qualified"
            ? "All required members completed their commitments before the group deadline."
            : selectedRecord?.result === "grace"
              ? "A grace day was consumed. The streak continued without breaking."
              : selectedRecord?.result === "missed"
                ? "The qualification threshold was not met. The group streak reset the following day."
                : isSameDay(selected, today)
                  ? group.qualificationNote
                  : "No commitments were scheduled for this date."}
        </p>
      </div>
    </div>
  );
}

export function GroupDetail() {
  const { groupId } = useParams();
  const { toast } = useApp();
  const [copied, setCopied] = useState(false);
  const [nudged, setNudged] = useState<string[]>([]);
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div className="space-y-5">
        <Link to="/accountability" className="inline-flex items-center gap-1.5 text-[11.5px] text-faint hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to accountability
        </Link>
        <EmptyState
          icon={Users}
          title="Group not found"
          description="This group may have been archived or you no longer have access to it."
          action={<Link to="/accountability"><Button variant="primary" size="sm">View your groups</Button></Link>}
        />
      </div>
    );
  }

  const members = group.memberIds.map(personById);
  const progress = Math.round((group.memberDone / group.memberTotal) * 100);
  const inviteLink = `devstreak.app/join/${group.id}`;
  const groupActivity = activities.filter((a) => group.memberIds.includes(a.actorId)).slice(0, 6);
  const recentHistory = [...group.history].slice(-7).reverse();
  const graceUsed = group.history.filter((h) => h.result === "grace").length;
  const qualifiedDays = group.history.filter((h) => h.result === "qualified").length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[{ label: "Accountability", href: "/accountability" }, { label: group.name }]}
        title={
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-elevated text-lg">
              {group.emoji}
            </span>
            {group.name}
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{group.memberTotal} members</span>
            <span className="text-line">·</span>
            <span>{group.timezone}</span>
            <span className="text-line">·</span>
            <span>{group.policy} policy</span>
          </span>
        }
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast({ tone: "info", title: "Group notifications", description: "You'll be notified when members complete commitments or the streak is at risk." })}
            >
              <Bell className="h-3.5 w-3.5" /> Notifications
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(`https://${inviteLink}`).catch(() => {});
                setCopied(true);
                toast({ tone: "success", title: "Invite link copied", description: "Share it with someone you trust to show up." });
                window.setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Invite link"}
            </Button>
          </>
        }
      />

      <section className="card relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber/[0.08] blur-[70px]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={group.todayQualified ? "green" : "amber"} dot>
                {group.todayQualified ? "Qualified today" : "Qualification in progress"}
              </Badge>
              <Badge tone="outline" className="text-[9.5px]">{group.gracePeriod}</Badge>
              <span className="inline-flex items-center gap-1 text-[10px] text-faint">
                <Clock className="h-3 w-3" /> Closes at 23:59 {group.timezone.split("/")[1]?.replace("_", " ")}
              </span>
            </div>

            <div className="mt-4 flex items-end gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">Current group streak</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <Flame className="h-6 w-6 text-amber" fill="currentColor" fillOpacity={0.25} />
                  <span className="number text-[40px] font-semibold leading-none tracking-tight text-ink">{group.streak}</span>
                  <span className="text-[12px] text-muted">days</span>
                </div>
              </div>
              <div className="mb-1 flex gap-5">
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-faint">Longest</p>
                  <p className="number text-[15px] font-semibold text-ink">{group.longest}d</p>
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-faint">Completion</p>
                  <p className="number text-[15px] font-semibold text-accent-bright">{group.rate}%</p>
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-wider text-faint">Grace used</p>
                  <p className="number text-[15px] font-semibold text-amber">{graceUsed}</p>
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-[11.5px] leading-relaxed text-muted">
              {group.qualificationNote}
            </p>

            <div className="mt-5 rounded-xl border border-line bg-canvas/50 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-medium text-ink">Today's qualification</span>
                <span className="number text-[10.5px] text-muted">{group.memberDone}/{group.memberTotal} complete</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={progress} color={group.todayQualified ? "green" : progress >= 50 ? "amber" : "neutral"} size="lg" className="flex-1" />
                <span className="number shrink-0 text-[12px] font-semibold text-ink">{progress}%</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-faint">
                <span className="inline-flex items-center gap-1"><Check className="h-2.5 w-2.5 text-accent-bright" /> {group.memberDone} members complete</span>
                <span className="inline-flex items-center gap-1"><X className="h-2.5 w-2.5 text-amber" /> {group.memberTotal - group.memberDone} pending</span>
                <span>·</span>
                <span>{qualifiedDays} qualified days in history</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between rounded-xl border border-line bg-canvas/40 p-3">
              <div>
                <p className="text-[9.5px] font-medium uppercase tracking-wider text-faint">Members</p>
                <div className="mt-1.5 flex -space-x-2">
                  {members.map((m) => (
                    <Avatar key={m.id} person={m} size="md" ring />
                  ))}
                </div>
              </div>
              <RingProgress value={progress} size={72} stroke={6} color={group.todayQualified ? "rgb(var(--accent-bright))" : "rgb(var(--amber))"}>
                <div className="text-center">
                  <span className="number block text-[15px] font-semibold leading-none text-ink">{group.memberDone}</span>
                  <span className="text-[7.5px] uppercase tracking-wider text-faint">of {group.memberTotal}</span>
                </div>
              </RingProgress>
            </div>

            <div className="rounded-xl border border-line bg-canvas/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-ink">Invite to {group.name}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://${inviteLink}`).catch(() => {});
                    toast({ tone: "success", title: "Invite link copied" });
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-accent-bright hover:underline"
                >
                  <Copy className="h-2.5 w-2.5" /> Copy
                </button>
              </div>
              <code className="mt-1.5 block truncate rounded-md border border-line bg-surface px-2 py-1.5 font-mono text-[9.5px] text-faint">
                {inviteLink}
              </code>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-amber/20 bg-amber/[0.04] px-3 py-2.5">
              <Trophy className="h-3.5 w-3.5 shrink-0 text-amber" />
              <p className="text-[9.5px] leading-relaxed text-muted">
                Next milestone at <span className="font-semibold text-ink">30 days</span> — {30 - group.streak} more qualified days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <section>
            <SectionHeader
              title="Today's member progress"
              description="Completion state only — private tasks and repository details stay hidden."
              action={<Badge tone="neutral" className="text-[9px]">{group.memberTotal} members</Badge>}
            />
            <div className="mt-3 space-y-2.5">
              {members.map((m) => {
                const isYou = m.id === "alex";
                const synthetic =
                  syntheticCommitments[m.id] ?? { done: [], pending: [] };
                const pct = Math.round((m.commitmentsDone / Math.max(1, m.commitmentsTotal)) * 100);
                const isNudged = nudged.includes(m.id);
                return (
                  <div key={m.id} className="card p-3.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <Avatar person={m} size="md" status={m.today === "complete" ? "complete" : "pending"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[12.5px] font-semibold text-ink">
                            {m.name}
                            {isYou && <span className="ml-1.5 text-[9px] font-medium text-faint">(you)</span>}
                          </p>
                          <Badge
                            tone={m.today === "complete" ? "green" : m.today === "in_progress" ? "blue" : m.today === "attention" ? "red" : "neutral"}
                            dot
                            className="text-[8.5px]"
                          >
                            {m.today === "complete"
                              ? "Complete"
                              : m.today === "in_progress"
                                ? "In progress"
                                : m.today === "attention"
                                  ? "Attention"
                                  : "Not started"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-[10px] text-faint">
                          {m.commitmentsDone} of {m.commitmentsTotal} commitments verified ·{" "}
                          {m.commitmentsTotal - m.commitmentsDone} pending
                        </p>
                      </div>
                      {!isYou && m.today !== "complete" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setNudged((p) => [...p, m.id]);
                            toast({ tone: "success", title: `Nudge sent to ${m.name.split(" ")[0]}`, description: "A quiet reminder, visible only to them." });
                          }}
                        >
                          <Bell className="h-3 w-3" /> {isNudged ? "Nudged" : "Nudge"}
                        </Button>
                      )}
                      <div className="flex w-full items-center gap-2 sm:w-36">
                        <Progress value={pct} color={pct === 100 ? "green" : pct > 0 ? "blue" : "neutral"} size="sm" />
                        <span className="number shrink-0 text-[9.5px] text-faint">{pct}%</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-line-soft pt-2.5">
                      {synthetic.done.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded border border-accent/20 bg-accent/[0.05] px-1.5 py-0.5 text-[9px] text-accent-bright">
                          <Check className="h-2.5 w-2.5" /> {c}
                        </span>
                      ))}
                      {synthetic.pending.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded border border-line bg-ink/[0.02] px-1.5 py-0.5 text-[9px] text-faint">
                          <Clock className="h-2.5 w-2.5" /> {c}
                        </span>
                      ))}
                      {synthetic.done.length === 0 && synthetic.pending.length === 0 && (
                        <span className="text-[9px] text-faint">No commitments shared for today.</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <SectionHeader
                title="Recent group activity"
                description="Verified signals from group members"
                action={<Link to="/activity" className="text-[11px] font-medium text-muted hover:text-ink">View all</Link>}
              />
            </div>
            <div className="divide-y divide-line-soft px-4">
              {groupActivity.map((a) => (
                <ActivityRow key={a.id} event={a} />
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <GroupCalendar group={group} />

          <div className="card p-4">
            <SectionHeader title="Qualification policy" description="How this group's streak is evaluated" />
            <div className="mt-3 space-y-2.5 text-[10.5px]">
              {[
                { label: "Policy", value: group.policy },
                { label: "Grace period", value: group.gracePeriod },
                { label: "Timezone", value: group.timezone },
                { label: "Day closes", value: "23:59 local time" },
                { label: "Members", value: `${group.memberTotal} of 5 max` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 border-b border-line-soft pb-2 last:border-0 last:pb-0">
                  <span className="text-faint">{row.label}</span>
                  <span className="text-right font-medium text-muted">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-canvas/40 px-2.5 py-2">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-blue" />
              <p className="text-[9.5px] leading-relaxed text-faint">
                {group.policyDetail} Qualification is evaluated at local midnight and cannot be
                overridden by manual edits.
              </p>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-semibold text-ink">Last 7 days</h3>
              <span className="text-[9.5px] text-faint">{group.rate}% completion</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              {recentHistory.map((h) => (
                <div key={h.date} className="flex items-center justify-between rounded-lg border border-line bg-canvas/40 px-2.5 py-1.5">
                  <span className="font-mono text-[9.5px] text-muted">
                    {format(parseISO(h.date), "EEE, d MMM")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[9px] font-medium",
                      h.result === "qualified" && "text-accent-bright",
                      h.result === "grace" && "text-amber",
                      h.result === "missed" && "text-danger",
                    )}
                  >
                    {h.result === "qualified" ? <CheckCircle2 className="h-2.5 w-2.5" /> : h.result === "grace" ? <ShieldCheck className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                    {h.result === "qualified" ? "Qualified" : h.result === "grace" ? "Grace used" : "Missed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <StreakCalendar />

          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface/60 px-3.5 py-3">
            <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
            <p className="text-[10px] leading-relaxed text-faint">
              Group milestones are celebrated separately from personal streaks. A group failure never
              resets your personal streak.
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/accountability"
        className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-faint transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all groups
      </Link>
    </div>
  );
}
