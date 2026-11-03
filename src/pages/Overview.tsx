import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Progress, RingProgress } from "@/components/ui/Progress";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { VerificationLegend } from "@/components/tasks/Verification";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { StreakFlame } from "@/components/streak/StreakFlame";
import { GroupCard } from "@/components/accountability/GroupCard";
import { ActivityRow } from "@/components/activity/ActivityRow";
import { activities, currentUser, groups, people } from "@/lib/data";
import { greeting, longDate, cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { Task } from "@/lib/types";

function StreakStat({
  label,
  value,
  unit,
  sub,
  tone,
  visual,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  sub: React.ReactNode;
  tone: "amber" | "blue" | "green";
  visual: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="card relative overflow-hidden p-4 sm:p-5">
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-3xl",
          tone === "amber" && "bg-amber/15",
          tone === "blue" && "bg-blue/10",
          tone === "green" && "bg-accent/10",
        )}
      />
      <div className="relative flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-faint">{label}</span>
        {icon}
      </div>
      <div className="relative mt-2.5 flex items-baseline gap-1.5">
        <span className="number text-[32px] font-semibold leading-none tracking-tight text-ink">{value}</span>
        <span className="text-[11px] text-faint">{unit}</span>
      </div>
      <div className="relative mt-3">{visual}</div>
      <div className="relative mt-2.5 text-[10.5px] leading-relaxed text-faint">{sub}</div>
    </div>
  );
}

export function Overview() {
  const { tasks, unreadCount } = useApp();
  const [selected, setSelected] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const verified = tasks.filter((t) => t.commitmentMet).length;
  const total = tasks.length;
  const progress = Math.round((verified / total) * 100);

  const openTask = (task: Task) => {
    setSelected(task);
    setDrawerOpen(true);
  };

  const featured = tasks.slice(0, 4);
  const group = groups[0];
  const groupMembers = group.memberIds.map((id) => people.find((p) => p.id === id)!);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-faint">
            <CalendarDays className="h-3.5 w-3.5" />
            {longDate()}
            <span className="h-1 w-1 rounded-full bg-line" />
            <span className="inline-flex items-center gap-1 text-accent-bright">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-bright" />
              Activity monitoring live
            </span>
          </div>
          <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-ink sm:text-[30px]">
            {greeting()}, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Twelve days of showing up. Let's make it thirteen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => openTask(tasks[0])}>
            <Sparkles className="h-3.5 w-3.5 text-amber" />
            Daily review
          </Button>
          <Link to="/tasks">
            <Button variant="primary" size="sm">
              Today's tasks <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StreakStat
          label="Personal streak"
          value="12"
          unit="days"
          tone="amber"
          icon={<StreakFlame size="sm" />}
          visual={
            <div className="flex items-end gap-1">
              {[70, 45, 90, 62, 80, 100, 34].map((h, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={cn(
                      "w-full rounded-[2px]",
                      i === 6 ? "bg-amber/35" : "bg-amber/75",
                    )}
                    style={{ height: `${Math.max(6, (h / 100) * 26)}px` }}
                  />
                </div>
              ))}
            </div>
          }
          sub={
            <span>
              <span className="text-accent-bright">3 of 5</span> commitments verified today ·{" "}
              <span className="text-muted">4 days to 30-day milestone</span>
            </span>
          }
        />
        <StreakStat
          label="Longest personal streak"
          value="34"
          unit="days"
          tone="blue"
          icon={
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-blue/25 bg-blue/10 text-blue">
              <TrendingUp className="h-4 w-4" />
            </span>
          }
          visual={
            <div className="flex items-center gap-2">
              <Progress value={72} color="blue" size="sm" />
              <span className="number shrink-0 text-[10px] text-faint">12/34</span>
            </div>
          }
          sub={
            <span>
              Personal best reached <span className="text-muted">4 Oct 2026</span>. 22 days to beat it.
            </span>
          }
        />
        <StreakStat
          label="Best group streak"
          value="41"
          unit="days"
          tone="green"
          icon={
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent-bright">
              <Users className="h-4 w-4" />
            </span>
          }
          visual={
            <div className="flex items-center justify-between">
              <AvatarStack people={groupMembers} size="xs" max={4} />
              <Badge tone="green" dot className="text-[9px]">Ship It Squad</Badge>
            </div>
          }
          sub={
            <span>
              Current group streak <span className="text-ink">21 days</span> · 3 of 4 complete today.
            </span>
          }
        />
      </div>

      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          <RingProgress value={progress} size={58} stroke={5} color="rgb(var(--accent-bright))">
            <div className="text-center">
              <span className="number block text-[13px] font-semibold leading-none text-ink">
                {verified}/{total}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-faint">done</span>
            </div>
          </RingProgress>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">Today's commitment status</p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted">
              {verified} verified · {total - verified} remaining · next deadline{" "}
              <span className="font-mono text-ink">18:00</span>
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge tone="green" dot className="text-[9.5px]">Verified {verified}</Badge>
              <Badge tone="violet" dot className="text-[9.5px]">Activity 1</Badge>
              <Badge tone="red" dot className="text-[9.5px]">Attention 1</Badge>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-canvas/50 px-3 py-2">
          <AvatarStack people={groupMembers} size="xs" max={4} />
          <div>
            <p className="text-[10px] font-medium text-ink">Ship It Squad · 3/4</p>
            <p className="text-[9.5px] text-faint">Waiting on Jonas</p>
          </div>
          <Link
            to="/accountability/ship-it-squad"
            className="ml-1 grid h-6 w-6 place-items-center rounded-md text-faint transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="View group"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <section>
            <SectionHeader
              title={
                <span className="flex items-center gap-2">
                  Today's commitments
                  <Badge tone="neutral" className="text-[9.5px]">{total}</Badge>
                </span>
              }
              description="Source sync, coding evidence and commitment completion are tracked separately."
              action={
                <Link
                  to="/tasks"
                  className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              }
            />
            <VerificationLegend className="mt-2.5" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {featured.map((task) => (
                <TaskCard key={task.id} task={task} onOpen={openTask} compact />
              ))}
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3.5">
              <SectionHeader
                title="Recent activity"
                description="Verified signals across your connected platforms"
                action={
                  <Link
                    to="/activity"
                    className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
                  >
                    View timeline <ArrowUpRight className="h-3 w-3" />
                  </Link>
                }
              />
            </div>
            <div className="divide-y divide-line-soft px-4">
              {activities.slice(0, 5).map((a) => (
                <ActivityRow key={a.id} event={a} />
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <StreakCalendar />

          <section>
            <SectionHeader
              title="Accountability"
              description="Independent group streaks"
              action={
                <Link
                  to="/accountability"
                  className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
                >
                  All groups <ArrowUpRight className="h-3 w-3" />
                </Link>
              }
            />
            <div className="mt-3 space-y-3">
              {groups.slice(0, 2).map((g) => (
                <GroupCard key={g.id} group={g} compact />
              ))}
            </div>
          </section>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-semibold text-ink">Your partners</h3>
              <Badge tone="neutral" className="text-[9.5px]">5 active</Badge>
            </div>
            <div className="mt-3 space-y-2.5">
              {people.slice(1, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <Avatar person={p} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-medium text-ink">{p.name}</p>
                    <p className="truncate text-[9.5px] text-faint">@{p.handle}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9.5px] text-faint">
                    <Flame className="h-3 w-3 text-amber" />
                    {p.streak}d
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      p.today === "complete" ? "bg-accent-bright" : p.today === "in_progress" ? "bg-blue" : "bg-faint/50",
                    )}
                    title={`${p.today.replace("_", " ")} today`}
                  />
                </div>
              ))}
            </div>
            <Link
              to="/accountability"
              className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-dashed border-line py-1.5 text-[10.5px] font-medium text-faint transition-colors hover:border-faint/50 hover:text-ink"
            >
              <Users className="h-3 w-3" /> Manage partners
            </Link>
          </div>

          <div className="rounded-xl border border-amber/20 bg-amber/[0.04] p-3.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber" />
              <p className="text-[11px] font-medium text-ink">4 days to your 30-day milestone</p>
            </div>
            <Progress value={12 / 30 * 100} color="amber" size="sm" className="mt-2.5" />
            <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
              {unreadCount} unread notifications · Keep your commitments verified to unlock it.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-line-soft pt-4 text-[10.5px] text-faint sm:flex-row">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> All commitments close at 23:59 Europe/Berlin
        </span>
        <span>Activity last checked 1 minute ago · Treasury of proof, not promises.</span>
      </div>

      <TaskDrawer task={selected} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
