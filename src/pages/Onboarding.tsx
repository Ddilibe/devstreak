import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Github,
  Globe2,
  Hash,
  Link2,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GithubIcon, HuggingFaceIcon, TrelloIcon } from "@/components/brand/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Input, Field, Toggle, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const steps = [
  { key: "profile", title: "Your developer profile", short: "Profile", icon: User },
  { key: "tasks", title: "Connect a task platform", short: "Tasks", icon: TrelloIcon },
  { key: "activity", title: "Connect coding platforms", short: "Activity", icon: Github },
  { key: "projects", title: "Choose what to monitor", short: "Projects", icon: Link2 },
  { key: "commitments", title: "Configure daily commitments", short: "Commitments", icon: ShieldCheck },
  { key: "timezone", title: "Set your rhythm", short: "Timezone", icon: Globe2 },
  { key: "partners", title: "Invite accountability partners", short: "Partners", icon: Mail },
];

const repoOptions = [
  { id: "web", name: "devstreak/web-app", meta: "GitHub · TypeScript · active", platform: "github" as const },
  { id: "auth", name: "devstreak/auth-service", meta: "GitHub · Go · active", platform: "github" as const },
  { id: "design", name: "devstreak/design-system", meta: "GitHub · React · active", platform: "github" as const },
  { id: "whisper", name: "mangino/whisper-finetune", meta: "Hugging Face · Model · active", platform: "huggingface" as const },
  { id: "lora", name: "mangino/code-reviewer-lora", meta: "Hugging Face · Model · active", platform: "huggingface" as const },
  { id: "platform", name: "Platform API board", meta: "Trello · 24 cards · 3 members", platform: "trello" as const },
];

const suggestions = [
  { name: "Mira Chen", handle: "@miracodes", desc: "Staff Engineer · 41-day streak" },
  { name: "Jonas Weber", handle: "@jonasw", desc: "Backend Engineer · 9-day streak" },
  { name: "Priya Nair", handle: "@priyanair", desc: "ML Engineer · 28-day streak" },
];

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-ink sm:text-[26px]">{title}</h1>
      <p className="mt-1.5 max-w-lg text-[12.5px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function ConnectionCard({
  name,
  description,
  connected,
  onToggle,
  icon,
  scopes,
  tone,
}: {
  name: string;
  description: string;
  connected: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  scopes: string[];
  tone: string;
}) {
  return (
    <div className={cn("card overflow-hidden transition-colors", connected && "border-accent/30")}>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl border", tone)}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13.5px] font-semibold text-ink">{name}</h3>
            {connected ? (
              <Badge tone="green" dot className="text-[9.5px]">Connected</Badge>
            ) : (
              <Badge tone="neutral" className="text-[9.5px]">Not connected</Badge>
            )}
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {scopes.map((s) => (
              <span key={s} className="rounded border border-line bg-ink/[0.025] px-1.5 py-0.5 font-mono text-[9px] text-faint">
                {s}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant={connected ? "secondary" : "primary"}
          size="sm"
          onClick={onToggle}
          className="shrink-0"
        >
          {connected ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent-bright" /> Connected
            </>
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Alex Rivera");
  const [handle, setHandle] = useState("alexrivera");
  const [role, setRole] = useState("Senior Frontend Engineer");
  const [trello, setTrello] = useState(false);
  const [github, setGithub] = useState(false);
  const [hf, setHf] = useState(false);
  const [repos, setRepos] = useState<string[]>(["web", "auth"]);
  const [commitments, setCommitments] = useState(3);
  const [rule, setRule] = useState("any");
  const [requireEvidence, setRequireEvidence] = useState(true);
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const [cutoff, setCutoff] = useState("23:59");
  const [reminder, setReminder] = useState("18:00");
  const [invites, setInvites] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const isLast = step === steps.length - 1;
  const connectedCount = [trello, github, hf].filter(Boolean).length;

  const toggleRepo = (id: string) =>
    setRepos((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const addInvite = (email: string) => {
    if (!email.trim() || invites.includes(email.trim())) return;
    setInvites((prev) => [...prev, email.trim()]);
    setInviteEmail("");
  };

  const next = () => {
    if (isLast) {
      toast({
        tone: "success",
        title: "Welcome to DevStreak",
        description: "Your workspace is ready. Your first daily commitment window opens now.",
      });
      navigate("/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-faint sm:inline">
              Step {step + 1} of {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Save & exit
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">Setup</p>
            <ol className="mt-4 space-y-0.5">
              {steps.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => setStep(i)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                        active ? "bg-accent/[0.08]" : "hover:bg-ink/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-md border text-[9px] font-semibold",
                          done && "border-accent/30 bg-accent/15 text-accent-bright",
                          active && "border-accent/40 bg-accent text-white",
                          !done && !active && "border-line bg-surface text-faint",
                        )}
                      >
                        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-[11.5px] font-medium",
                          active ? "text-ink" : done ? "text-muted" : "text-faint",
                        )}
                      >
                        {s.short}
                      </span>
                      {active && <span className="ml-auto h-1 w-1 rounded-full bg-accent-bright" />}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 rounded-xl border border-line bg-card p-3">
              <div className="flex items-center justify-between text-[10px] text-faint">
                <span>Setup progress</span>
                <span className="number">{Math.round((step / steps.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-accent-bright transition-all duration-500"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="mt-2.5 text-[10px] leading-relaxed text-faint">
                You can skip any step and connect integrations later from settings.
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-5 flex gap-1 lg:hidden">
            {steps.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= step ? "bg-accent-bright" : "bg-ink/10",
                )}
              />
            ))}
          </div>

          <div key={step} className="animate-fade-in-up">
            {step === 0 && (
              <>
                <StepHeading
                  title="Let's set up your developer profile"
                  description="This is what accountability partners see. Your tasks and repositories stay private unless you share them."
                />
                <div className="space-y-5">
                  <div className="card flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
                    <Avatar person={{ ...{ id: "x", name, handle, role, color: "from-emerald-400 to-teal-500", accent: "#22C55E", streak: 0, today: "pending", commitmentsDone: 0, commitmentsTotal: 0 } }} size="xl" />
                    <div className="flex-1">
                      <p className="text-[12.5px] font-medium text-ink">Profile photo</p>
                      <p className="mt-0.5 text-[11px] text-faint">A clear face or avatar helps partners recognize you.</p>
                      <div className="mt-2 flex gap-2">
                        <Button size="xs" variant="secondary">Upload image</Button>
                        <Button size="xs" variant="ghost">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Display name">
                      <Input value={name} onChange={(e) => setName(e.target.value)} icon={<User className="h-3.5 w-3.5" />} />
                    </Field>
                    <Field label="Handle" hint="devstreak.app/@your-handle">
                      <Input value={handle} onChange={(e) => setHandle(e.target.value)} icon={<Hash className="h-3.5 w-3.5" />} />
                    </Field>
                  </div>
                  <Field label="Role / headline" optional>
                    <Input value={role} onChange={(e) => setRole(e.target.value)} />
                  </Field>
                  <Field label="Short bio" optional hint="One line about what you're building right now.">
                    <textarea
                      rows={3}
                      placeholder="Frontend engineer building developer tools. Currently shipping DevStreak's design system."
                      className="w-full resize-none rounded-xl border border-line bg-surface px-3 py-2.5 text-[13.5px] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15"
                    />
                  </Field>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <StepHeading
                  title="Bring your tasks with you"
                  description="Connect a task management platform so DevStreak can turn existing cards into daily commitments. Manual commitments work too."
                />
                <div className="space-y-3">
                  <ConnectionCard
                    name="Trello"
                    description="Import boards, lists, cards, deadlines and assignments. Source status syncs automatically every few minutes."
                    connected={trello}
                    onToggle={() => setTrello((v) => !v)}
                    icon={<TrelloIcon className="h-5 w-5 text-[#2E9BE6]" />}
                    scopes={["boards:read", "cards:write", "webhooks"]}
                    tone="border-blue/25 bg-blue/[0.06]"
                  />
                  <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-ink/[0.015] px-4 py-3">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                    <p className="text-[11px] leading-relaxed text-muted">
                      <span className="font-medium text-ink">No task platform?</span> You can create
                      manual commitments and still verify them with coding activity. Skipping this
                      step is completely fine.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepHeading
                  title="Connect where you actually code"
                  description="These platforms provide verifiable evidence: commits, pull requests, reviews and repository updates. Connections are read-only."
                />
                <div className="space-y-3">
                  <ConnectionCard
                    name="GitHub"
                    description="Monitor commits, branches, pull requests, reviews and merged contributions across selected repositories."
                    connected={github}
                    onToggle={() => setGithub((v) => !v)}
                    icon={<GithubIcon className="h-5 w-5 text-ink" />}
                    scopes={["repo:read", "pull_requests:read", "webhooks"]}
                    tone="border-line bg-ink/[0.03]"
                  />
                  <ConnectionCard
                    name="Hugging Face"
                    description="Monitor repository updates, model and dataset contributions, commits and discussions."
                    connected={hf}
                    onToggle={() => setHf((v) => !v)}
                    icon={<HuggingFaceIcon className="h-5 w-5" />}
                    scopes={["repos:read", "discussions:read"]}
                    tone="border-amber/25 bg-amber/[0.05]"
                  />
                  <div className="flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/[0.04] px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
                    <p className="text-[11px] leading-relaxed text-muted">
                      DevStreak never reads file contents, writes to repositories, or accesses private
                      data outside the scopes you approve.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <StepHeading
                  title="Choose what DevStreak can monitor"
                  description="Only selected projects are used for activity verification. You can change this at any time."
                />
                <div className="card divide-y divide-line-soft">
                  {repoOptions.map((r) => {
                    const checked = repos.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRepo(r.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink/[0.02]"
                      >
                        <span
                          className={cn(
                            "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors",
                            checked
                              ? "border-accent bg-accent text-white"
                              : "border-line bg-surface",
                          )}
                        >
                          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line bg-elevated">
                          {r.platform === "github" && <GithubIcon className="h-3.5 w-3.5" />}
                          {r.platform === "huggingface" && <HuggingFaceIcon className="h-4 w-4" />}
                          {r.platform === "trello" && <TrelloIcon className="h-4 w-4 text-[#2E9BE6]" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-mono text-[11.5px] text-ink">{r.name}</span>
                          <span className="block text-[10px] text-faint">{r.meta}</span>
                        </span>
                        <Badge tone="outline" className="hidden text-[9px] sm:inline-flex">
                          {r.platform === "trello" ? "Tasks" : "Evidence"}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[10.5px] text-faint">
                  {repos.length} project{repos.length === 1 ? "" : "s"} selected
                </p>
              </>
            )}

            {step === 4 && (
              <>
                <StepHeading
                  title="Define what a successful day looks like"
                  description="Commitments are the unit of your streak. Set a realistic target and choose what counts as proof."
                />
                <div className="space-y-5">
                  <div className="card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-ink">Daily commitments</p>
                        <p className="mt-0.5 text-[11px] text-faint">How many tasks should count as a complete day?</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCommitments((c) => Math.max(1, c - 1))}
                          className="grid h-7 w-7 place-items-center rounded-md border border-line text-muted hover:bg-ink/5"
                        >
                          −
                        </button>
                        <span className="number w-6 text-center text-lg font-semibold text-ink">{commitments}</span>
                        <button
                          onClick={() => setCommitments((c) => Math.min(5, c + 1))}
                          className="grid h-7 w-7 place-items-center rounded-md border border-line text-muted hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 border-t border-line-soft pt-3 text-[10.5px] leading-relaxed text-faint">
                      {commitments <= 2
                        ? "Light pace — good for recovery weeks or deep-work periods."
                        : commitments === 3
                          ? "Balanced pace used by 68% of DevStreak members."
                          : "Ambitious pace. Make sure your commitments are small enough to finish."}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[12px] font-medium text-ink">Default evidence rule</p>
                    <div className="space-y-2">
                      {[
                        {
                          id: "any",
                          title: "Any qualifying activity",
                          desc: "A commit, PR, review or repository update linked to the task's project.",
                        },
                        {
                          id: "merge",
                          title: "Merged contribution",
                          desc: "The task only counts when a pull request is merged. Stricter, fewer false positives.",
                        },
                        {
                          id: "manual",
                          title: "Manual confirmation",
                          desc: "You confirm completion; coding activity is recorded but not required. Weaker verification.",
                        },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRule(r.id)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                            rule === r.id
                              ? "border-accent/40 bg-accent/[0.05]"
                              : "border-line bg-card hover:border-faint/40",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                              rule === r.id ? "border-accent bg-accent" : "border-line",
                            )}
                          >
                            {rule === r.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <span>
                            <span className="block text-[12px] font-medium text-ink">{r.title}</span>
                            <span className="mt-0.5 block text-[10.5px] leading-relaxed text-faint">{r.desc}</span>
                          </span>
                          {r.id === "manual" && (
                            <Badge tone="amber" className="ml-auto shrink-0 text-[8.5px]">Demo only</Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card p-4">
                    <Toggle
                      checked={requireEvidence}
                      onChange={setRequireEvidence}
                      label="Require verified evidence before a commitment counts"
                      description="Recommended. This keeps the streak honest and prevents source-task completion from being treated as real progress."
                    />
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <StepHeading
                  title="Set your daily rhythm"
                  description="Your streak day, deadlines and reminders follow your timezone — not the server's."
                />
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Timezone" hint="Used for day boundaries and group qualification.">
                      <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                        <option value="Europe/Berlin">Europe/Berlin (UTC+1)</option>
                        <option value="Europe/London">Europe/London (UTC+0)</option>
                        <option value="America/New_York">America/New_York (UTC−5)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (UTC−8)</option>
                        <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      </Select>
                    </Field>
                    <Field label="Week starts on">
                      <Select defaultValue="monday">
                        <option value="monday">Monday</option>
                        <option value="sunday">Sunday</option>
                      </Select>
                    </Field>
                    <Field label="Daily cutoff" hint="Commitments after this time count toward the next day.">
                      <Input type="time" value={cutoff} onChange={(e) => setCutoff(e.target.value)} icon={<Clock className="h-3.5 w-3.5" />} />
                    </Field>
                    <Field label="Reminder time" hint="When we nudge you about unfinished commitments.">
                      <Input type="time" value={reminder} onChange={(e) => setReminder(e.target.value)} icon={<Clock className="h-3.5 w-3.5" />} />
                    </Field>
                  </div>

                  <div className="card p-4">
                    <p className="text-[12px] font-semibold text-ink">A day in your DevStreak</p>
                    <div className="mt-3 space-y-2.5">
                      {[
                        { time: "00:00", label: "New commitment day begins", detail: "Tasks scheduled for today become active" },
                        { time: reminder, label: "Progress reminder", detail: "Summary of verified and pending commitments" },
                        { time: cutoff, label: "Day closes", detail: "Unverified commitments are marked missed" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          <span className="w-10 shrink-0 pt-0.5 font-mono text-[10px] text-faint">{item.time}</span>
                          <span className="relative flex flex-col items-center pt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                            <span className="mt-1 h-6 w-px bg-line last:hidden" />
                          </span>
                          <span>
                            <span className="block text-[11.5px] font-medium text-ink">{item.label}</span>
                            <span className="block text-[10px] text-faint">{item.detail}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <StepHeading
                  title="Consistency is easier with company"
                  description="Invite partners who will notice when you don't show up. They'll see completion status and streak health — never your private task details."
                />
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-[12px] font-medium text-ink">Suggested partners</p>
                    <div className="space-y-2">
                      {suggestions.map((s) => {
                        const added = invites.includes(s.handle);
                        return (
                          <div key={s.handle} className="card flex items-center gap-3 p-3">
                            <Avatar name={s.name} size="md" color="from-violet-400 to-indigo-500" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-medium text-ink">{s.name}</p>
                              <p className="text-[10.5px] text-faint">{s.desc}</p>
                            </div>
                            <Button
                              size="xs"
                              variant={added ? "secondary" : "outline"}
                              onClick={() => (added ? setInvites((p) => p.filter((i) => i !== s.handle)) : addInvite(s.handle))}
                            >
                              {added ? <><Check className="h-3 w-3 text-accent-bright" /> Invited</> : "Invite"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[12px] font-medium text-ink">Invite by email</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="partner@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInvite(inviteEmail);
                          }
                        }}
                        icon={<Mail className="h-3.5 w-3.5" />}
                      />
                      <Button variant="secondary" onClick={() => addInvite(inviteEmail)} className="shrink-0">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {invites.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {invites.map((i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-1 text-[10.5px] text-muted"
                          >
                            {i}
                            <button onClick={() => setInvites((p) => p.filter((x) => x !== i))} aria-label={`Remove ${i}`}>
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-line bg-card p-3.5">
                    <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                    <div className="flex-1">
                      <p className="text-[11.5px] font-medium text-ink">Or create a group later</p>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-faint">
                        You can create multiple independent groups with their own policies, grace
                        periods and timezones after setup.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber/20 bg-amber/[0.04] p-3.5">
                    <p className="text-[10.5px] leading-relaxed text-muted">
                      <span className="font-medium text-ink">Invitations expire in 7 days.</span>{" "}
                      Partners can accept without connecting integrations first — they'll see your
                      shared streak and daily completion progress.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse items-stretch gap-2.5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              ) : (
                <span className="px-1 text-[10.5px] text-faint">Takes about 2 minutes</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step < steps.length - 1 && (
                <Button variant="ghost" size="sm" onClick={() => setStep((s) => s + 1)}>
                  Skip
                </Button>
              )}
              <Button variant="primary" onClick={next} className="flex-1 sm:flex-none">
                {isLast ? "Enter DevStreak" : "Continue"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-faint sm:text-right">
            {connectedCount} of 3 integrations connected · {repos.length} projects monitored ·{" "}
            {invites.length} invitations pending
          </p>
        </main>
      </div>
    </div>
  );
}
