import { useMemo, useState } from "react";
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
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Filter,
  List,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select, Field, Textarea } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Overlay";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { StatusPill, VerificationLegend } from "@/components/tasks/Verification";
import { PlatformIcon, platformName } from "@/components/brand/BrandIcons";
import { useApp } from "@/context/AppContext";
import { generateHeat } from "@/lib/data";
import type { Platform, Task, TaskStatus } from "@/lib/types";
import { cn, deadlineLabel, dayKey } from "@/lib/utils";

type Tab = "today" | "attention" | "all";
type View = "list" | "calendar";

const heatByKey = new Map(generateHeat(200).map((d) => [d.key, d]));

function NewCommitmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addTask } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayKey());
  const [time, setTime] = useState("18:00");
  const [criteria, setCriteria] = useState("Any qualifying coding activity");
  const [repo, setRepo] = useState("devstreak/web-app");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const deadline = new Date(`${date}T${time}`).toISOString();
    addTask({
      id: `manual-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "Manual daily commitment.",
      platform: "manual",
      project: "Personal commitment",
      sourceStatus: "todo",
      status: "pending",
      criteria,
      evidence: [],
      deadline,
      commitmentMet: false,
      tag: "Manual",
    });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a daily commitment"
      description="Manual commitments work without a task platform. You still need qualifying activity to verify them."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={!title.trim()}>
            <Plus className="h-3.5 w-3.5" /> Create commitment
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Commitment title">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ship the analytics empty state"
            autoFocus
          />
        </Field>
        <Field label="What does done look like?" optional>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context so future-you knows exactly what to finish."
            className="min-h-20"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Scheduled date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Deadline">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Linked repository / project">
            <Select value={repo} onChange={(e) => setRepo(e.target.value)}>
              <option>devstreak/web-app</option>
              <option>devstreak/auth-service</option>
              <option>devstreak/design-system</option>
              <option>mangino/whisper-finetune</option>
              <option>None — manual only</option>
            </Select>
          </Field>
          <Field label="Evidence requirement">
            <Select value={criteria} onChange={(e) => setCriteria(e.target.value)}>
              <option>Any qualifying coding activity</option>
              <option>At least one merged pull request</option>
              <option>At least 2 commits</option>
              <option>A review or discussion reply</option>
            </Select>
          </Field>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg border border-line bg-canvas/50 px-3 py-2.5">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
          <p className="text-[10.5px] leading-relaxed text-faint">
            This commitment will appear under <span className="font-mono text-muted">{repo}</span> for
            verification. Completing the source task alone will not mark it verified.
          </p>
        </div>
      </form>
    </Modal>
  );
}

function TaskListRow({ task, onOpen }: { task: Task; onOpen: (t: Task) => void }) {
  const qualifying = task.evidence.filter((e) => e.qualified).length;
  return (
    <div
      className="group grid cursor-pointer grid-cols-1 gap-3 px-4 py-3.5 transition-colors hover:bg-ink/[0.02] sm:grid-cols-[minmax(0,1.7fr)_minmax(0,1.2fr)_auto] sm:items-center"
      onClick={() => onOpen(task)}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-elevated">
          <PlatformIcon platform={task.platform} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium text-ink group-hover:text-accent-bright">
            {task.title}
          </p>
          <p className="mt-0.5 truncate text-[10.5px] text-faint">
            {task.project} · {task.tag}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:pl-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px]",
            task.sourceStatus === "done" ? "text-blue" : "text-faint",
          )}
          title="Task synchronization"
        >
          <span className={cn("h-1.5 w-1.5 rounded-sm", task.sourceStatus === "done" ? "bg-blue" : "bg-faint/50")} />
          {task.sourceStatus === "done" ? `Done in ${platformName[task.platform]}` : "Source open"}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px]",
            task.evidence.length ? "text-violet" : "text-faint",
          )}
          title="Coding activity evidence"
        >
          <span className={cn("h-1.5 w-1.5 rounded-sm", task.evidence.length ? "bg-violet" : "bg-faint/50")} />
          {task.evidence.length ? `${qualifying} qualifying signal${qualifying === 1 ? "" : "s"}` : "No evidence"}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px]",
            task.commitmentMet ? "text-accent-bright" : "text-faint",
          )}
          title="Commitment completion"
        >
          {task.commitmentMet ? <Check className="h-2.5 w-2.5" /> : <Circle className="h-2 w-2" />}
          {task.commitmentMet ? "Commitment met" : "Not met"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="text-right">
          <p className="font-mono text-[10px] text-faint">{deadlineLabel(task.deadline)}</p>
          <div className="mt-1 flex justify-end">
            <StatusPill status={task.status} />
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

function TaskCalendar({
  tasks,
  onOpen,
  onSchedule,
}: {
  tasks: Task[];
  onOpen: (t: Task) => void;
  onSchedule: () => void;
}) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date>(new Date());
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leading = (getDay(startOfMonth(month)) + 6) % 7;
  const selectedTasks = tasks.filter((t) => isSameDay(parseISO(t.deadline), selected));
  const selectedHeat = heatByKey.get(dayKey(selected));
  const today = new Date();

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">{format(month, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonth(subMonths(month, 1))}
              className="grid h-7 w-7 place-items-center rounded-md border border-line text-faint hover:bg-ink/5 hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setMonth(startOfMonth(new Date()));
                setSelected(new Date());
              }}
              className="rounded-md px-2 py-1 text-[10.5px] font-medium text-muted hover:text-ink"
            >
              Today
            </button>
            <button
              onClick={() => setMonth(addMonths(month, 1))}
              className="grid h-7 w-7 place-items-center rounded-md border border-line text-faint hover:bg-ink/5 hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="pb-1 text-center font-mono text-[9.5px] text-faint">{d}</div>
          ))}
          {Array.from({ length: leading }).map((_, i) => (
            <div key={`b-${i}`} />
          ))}
          {days.map((day) => {
            const key = dayKey(day);
            const heat = heatByKey.get(key);
            const dayTasks = tasks.filter((t) => isSameDay(parseISO(t.deadline), day));
            const isSelected = isSameDay(day, selected);
            const isToday = isSameDay(day, today);
            const past = day < today && !isToday;
            return (
              <button
                key={key}
                onClick={() => setSelected(day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] transition-colors",
                  isSelected
                    ? "border-accent/50 bg-accent/[0.10] text-ink"
                    : "border-line bg-surface text-muted hover:bg-ink/[0.03] hover:text-ink",
                  isToday && !isSelected && "border-amber/50",
                )}
              >
                <span className={cn("number", isToday && "font-semibold text-amber")}>{format(day, "d")}</span>
                <span className="mt-0.5 flex h-1 gap-0.5">
                  {dayTasks.length > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-violet" />
                      <span className="h-1 w-1 rounded-full bg-amber" />
                    </>
                  )}
                  {past && heat?.status === "complete" && dayTasks.length === 0 && (
                    <span className="h-1 w-1 rounded-full bg-accent-bright/70" />
                  )}
                  {past && heat?.status === "missed" && (
                    <span className="h-1 w-1 rounded-full bg-danger/70" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-soft pt-3 text-[9.5px] text-faint">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-violet" /> Commitment scheduled</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent-bright/70" /> Day verified</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-danger/70" /> Missed</span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
              {isSameDay(selected, today) ? "Today" : format(selected, "EEEE")}
            </p>
            <h3 className="mt-0.5 text-[15px] font-semibold text-ink">{format(selected, "d MMMM yyyy")}</h3>
          </div>
          <Button variant="secondary" size="xs" onClick={onSchedule}>
            <Plus className="h-3 w-3" /> Schedule
          </Button>
        </div>

        <div className="mt-4">
          {selectedTasks.length > 0 ? (
            <div className="space-y-2">
              {selectedTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onOpen(t)}
                  className="flex w-full items-start gap-2.5 rounded-lg border border-line bg-canvas/40 p-2.5 text-left transition-colors hover:border-faint/40"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line bg-surface">
                    <PlatformIcon platform={t.platform} className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium text-ink">{t.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[9.5px] text-faint">
                      <span className={cn(
                        "h-1 w-1 rounded-full",
                        t.commitmentMet ? "bg-accent-bright" : t.status === "attention" ? "bg-danger" : "bg-amber",
                      )} />
                      {t.commitmentMet ? "Verified" : t.status === "attention" ? "Needs attention" : "Pending verification"}
                    </span>
                  </span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-faint" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
              <CalendarDays className="mx-auto h-5 w-5 text-faint" />
              <p className="mt-2 text-[11.5px] font-medium text-muted">
                {selectedHeat?.status === "complete" && selected < today
                  ? "This day's commitment was met"
                  : "No commitments scheduled"}
              </p>
              <p className="mx-auto mt-1 max-w-[220px] text-[10px] leading-relaxed text-faint">
                {selected < today
                  ? "The day has closed. Verification results are final."
                  : "Schedule a commitment so future-you knows what to focus on."}
              </p>
              {selected >= today && (
                <Button variant="outline" size="xs" className="mt-3" onClick={onSchedule}>
                  <Plus className="h-3 w-3" /> Add commitment
                </Button>
              )}
            </div>
          )}
        </div>

        {selectedTasks.length > 0 && (
          <div className="mt-4 rounded-lg border border-line bg-canvas/40 p-3">
            <div className="flex items-center justify-between text-[10px] text-faint">
              <span>Selected day completion</span>
              <span className="number">
                {selectedTasks.filter((t) => t.commitmentMet).length}/{selectedTasks.length} verified
              </span>
            </div>
            <div className="mt-2 flex gap-1">
              {selectedTasks.map((t) => (
                <span
                  key={t.id}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    t.commitmentMet ? "bg-accent-bright" : "bg-ink/10",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Tasks() {
  const { tasks, toast } = useApp();
  const [view, setView] = useState<View>("list");
  const [tab, setTab] = useState<Tab>("today");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [project, setProject] = useState("all");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [selected, setSelected] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const projects = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.project.split(" · ")[0]))),
    [tasks],
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (tab === "attention" && t.status !== "attention") return false;
      if (search && !(`${t.title} ${t.project} ${t.description}`.toLowerCase().includes(search.toLowerCase())))
        return false;
      if (platform !== "all" && t.platform !== platform) return false;
      if (project !== "all" && !t.project.startsWith(project)) return false;
      if (status !== "all" && t.status !== status) return false;
      return true;
    });
  }, [tasks, tab, search, platform, project, status]);

  const hasFilters = search !== "" || platform !== "all" || project !== "all" || status !== "all";

  const openTask = (task: Task) => {
    setSelected(task);
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setPlatform("all");
    setProject("all");
    setStatus("all");
  };

  const verified = tasks.filter((t) => t.commitmentMet).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Tasks"
        description="Synchronized tasks become daily commitments. Verification determines whether they count."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              loading={syncing}
              onClick={() => {
                setSyncing(true);
                window.setTimeout(() => {
                  setSyncing(false);
                  toast({
                    tone: "success",
                    title: "Synchronization complete",
                    description: "7 tasks checked across Trello, GitHub and Hugging Face. No new changes.",
                  });
                }, 1100);
              }}
            >
              {!syncing && <RefreshCw className="h-3.5 w-3.5" />}
              Sync now
            </Button>
            <Button variant="primary" size="sm" onClick={() => setNewOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> New commitment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Today's commitments", value: tasks.length, tone: "text-ink", sub: "scheduled" },
          { label: "Verified", value: verified, tone: "text-accent-bright", sub: "count toward streak" },
          {
            label: "Activity detected",
            value: tasks.filter((t) => t.status === "activity").length,
            tone: "text-violet",
            sub: "awaiting criteria",
          },
          {
            label: "Needs attention",
            value: tasks.filter((t) => t.status === "attention").length,
            tone: "text-danger",
            sub: "source done, no evidence",
          },
        ].map((s) => (
          <div key={s.label} className="card px-3.5 py-3">
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-faint">{s.label}</p>
            <p className={cn("number mt-1 text-xl font-semibold", s.tone)}>{s.value}</p>
            <p className="truncate text-[9.5px] text-faint">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: "today", label: "Today", count: tasks.length },
              { value: "attention", label: "Needs attention", count: tasks.filter((t) => t.status === "attention").length },
              { value: "all", label: "All tasks", count: tasks.length },
            ]}
          />
          <div className="ml-auto flex items-center rounded-xl border border-line bg-ink/[0.03] p-0.5 lg:hidden">
            {(
              [
                { v: "list", icon: List, label: "List" },
                { v: "calendar", icon: CalendarDays, label: "Calendar" },
              ] as const
            ).map((v) => (
              <button
                key={v.v}
                onClick={() => setView(v.v)}
                className={cn(
                  "inline-flex h-7 items-center gap-1 rounded-[9px] px-2.5 text-[11.5px] font-medium",
                  view === v.v ? "bg-elevated text-ink shadow-sm" : "text-muted",
                )}
              >
                <v.icon className="h-3 w-3" /> {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" onClick={() => setView("list")}>
            <List className={cn("h-3.5 w-3.5", view === "list" && "text-accent-bright")} /> List
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setView("calendar")}>
            <CalendarDays className={cn("h-3.5 w-3.5", view === "calendar" && "text-accent-bright")} /> Calendar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast({ tone: "info", title: "Advanced filters", description: "Date range, repository and evidence-rule filters are available in the demo." })}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> More filters
          </Button>
        </div>
      </div>

      <div className="card flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center">
        <div className="sm:w-[260px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            icon={<Search className="h-3.5 w-3.5" />}
          />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value as Platform | "all")} className="h-10 text-[12px]">
            <option value="all">All platforms</option>
            <option value="trello">Trello</option>
            <option value="github">GitHub</option>
            <option value="huggingface">Hugging Face</option>
            <option value="manual">Manual</option>
          </Select>
          <Select value={project} onChange={(e) => setProject(e.target.value)} className="h-10 text-[12px]">
            <option value="all">All projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | "all")} className="col-span-2 h-10 text-[12px] sm:col-span-1">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="activity">Activity detected</option>
            <option value="verified">Verified</option>
            <option value="attention">Needs attention</option>
          </Select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
        {!hasFilters && (
          <span className="hidden shrink-0 items-center gap-1.5 px-1 text-[10.5px] text-faint sm:flex">
            <Filter className="h-3 w-3" /> {filtered.length} shown
          </span>
        )}
      </div>

      {view === "calendar" ? (
        <TaskCalendar tasks={filtered} onOpen={openTask} onSchedule={() => setNewOpen(true)} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No tasks match these filters"
          description="Try removing a filter or search for something else. You can also create a manual commitment without a connected platform."
          action={
            <div className="flex gap-2">
              {hasFilters && <Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>}
              <Button variant="primary" size="sm" onClick={() => setNewOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> New commitment
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 px-1 sm:flex">
            <VerificationLegend />
            <span className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] text-faint">
              <RefreshCw className="h-3 w-3 text-accent-bright" /> Trello synced 4m ago · GitHub 1m ago
            </span>
          </div>

          <div className="card overflow-hidden">
            <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(0,1.2fr)_auto] items-center gap-3 border-b border-line bg-canvas/40 px-4 py-2 text-[9.5px] font-semibold uppercase tracking-wider text-faint sm:grid">
              <span>Task</span>
              <span className="pl-2">Verification state</span>
              <span className="pr-8 text-right">Deadline · status</span>
            </div>
            <div className="divide-y divide-line-soft">
              {filtered.map((t) => (
                <TaskListRow key={t.id} task={t} onOpen={openTask} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface/40 px-3.5 py-2.5">
            <p className="text-[10.5px] text-faint">
              Showing {filtered.length} of {tasks.length} commitments · 3 platforms connected
            </p>
            <div className="flex items-center gap-1.5">
              <Badge tone="blue" dot className="text-[9px]">Trello sync</Badge>
              <Badge tone="violet" dot className="text-[9px]">GitHub evidence</Badge>
              <Badge tone="amber" dot className="text-[9px]">Hugging Face evidence</Badge>
            </div>
          </div>

          <div className="sm:hidden">
            <div className="grid gap-3">
              {filtered.slice(0, 3).map((t) => (
                <TaskCard key={`card-${t.id}`} task={t} onOpen={openTask} compact />
              ))}
            </div>
          </div>
        </>
      )}

      <TaskDrawer task={selected} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <NewCommitmentModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}
