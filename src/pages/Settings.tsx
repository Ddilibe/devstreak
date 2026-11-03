import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Globe2,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Overlay";
import { useApp } from "@/context/AppContext";
import { currentUser, groups } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "profile" | "preferences" | "notifications" | "verification" | "account";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "account", label: "Account", icon: KeyRound },
];

function MiniSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[18px] w-[32px] items-center rounded-full border transition-colors",
        checked ? "border-accent/40 bg-accent" : "border-line bg-ink/10",
      )}
    >
      <span
        className={cn(
          "inline-block h-[12px] w-[12px] rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[16px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}

function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-line-soft px-5 py-4">
        <h2 className="text-[13.5px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">{description}</p>}
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="border-t border-line-soft bg-canvas/35 px-5 py-3">{footer}</div>}
    </section>
  );
}

export function Settings() {
  const { theme, toggleTheme, toast } = useApp();
  const [tab, setTab] = useState<Tab>("profile");
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [profileUrlCopied, setProfileUrlCopied] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    daily: { inapp: true, email: true, push: true },
    verification: { inapp: true, email: true, push: true },
    group: { inapp: true, email: false, push: false },
    partner: { inapp: true, email: false, push: false },
    weekly: { inapp: true, email: true, push: false },
    product: { inapp: false, email: true, push: false },
  });

  const [policy, setPolicy] = useState("balanced");
  const [evidence, setEvidence] = useState({
    commits: true,
    prs: true,
    reviews: true,
    merges: true,
    discussions: false,
  });
  const [graceDays, setGraceDays] = useState("1");
  const [autoProtect, setAutoProtect] = useState(true);
  const [manualVerify, setManualVerify] = useState(false);

  const [weekends, setWeekends] = useState(true);
  const [compact, setCompact] = useState(false);
  const [pauseAll, setPauseAll] = useState(false);

  const save = (section: string) =>
    toast({ tone: "success", title: "Settings saved", description: `${section} preferences updated.` });

  const copyProfile = () => {
    const url = `devstreak.app/@${currentUser.handle}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://${url}`).catch(() => {});
    }
    setProfileUrlCopied(true);
    toast({ tone: "success", title: "Profile link copied", description: url });
    window.setTimeout(() => setProfileUrlCopied(false), 1800);
  };

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader
        title="Settings"
        description="Manage your identity, how DevStreak verifies work, and when it reaches you. Nothing here changes historical verification."
        actions={
          <Button variant="secondary" size="sm" onClick={() => save("All")}>
            <Check className="h-3.5 w-3.5" /> Save changes
          </Button>
        }
      />

      <div className="-mx-1 overflow-x-auto px-1 no-scrollbar">
        <div className="inline-flex min-w-full gap-0.5 rounded-xl border border-line bg-ink/[0.02] p-1 sm:min-w-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition-all",
                tab === t.id
                  ? "bg-elevated text-ink shadow-sm ring-1 ring-line"
                  : "text-muted hover:text-ink",
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <Panel title="Public profile" description="This information appears on leaderboards and group pages.">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <Avatar person={currentUser} size="xl" />
                  <button
                    onClick={() => toast({ tone: "info", title: "Photo upload", description: "Choose an image to replace your initials." })}
                    className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-elevated text-muted shadow-sm hover:text-ink"
                    aria-label="Upload profile photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-ink">{currentUser.name}</p>
                    <Badge tone="green" dot className="text-[9px]">Pro</Badge>
                  </div>
                  <p className="mt-0.5 font-mono text-[10.5px] text-faint">@{currentUser.handle}</p>
                  <p className="mt-1 text-[11px] text-muted">{currentUser.role}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast({ tone: "info", title: "Photo upload", description: "JPG or PNG, up to 2 MB." })}
                >
                  <Camera className="h-3.5 w-3.5" /> Change photo
                </Button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input defaultValue={currentUser.name} />
                </Field>
                <Field label="Handle" hint="Used in your public profile URL.">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-faint">@</span>
                    <Input defaultValue={currentUser.handle} className="pl-7" />
                  </div>
                </Field>
                <Field label="Role">
                  <Input defaultValue={currentUser.role} />
                </Field>
                <Field label="Location" optional>
                  <Input defaultValue="Berlin, Germany" />
                </Field>
                <Field label="Timezone" className="sm:col-span-2">
                  <Select defaultValue="Europe/Berlin">
                    <option>Europe/Berlin</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Asia/Kolkata</option>
                  </Select>
                </Field>
                <Field label="Bio" optional className="sm:col-span-2" hint="Max 160 characters. Shown on your profile.">
                  <Textarea
                    defaultValue="Frontend engineer shipping developer tools. Currently focused on auth infrastructure and design systems."
                    maxLength={160}
                    className="min-h-20"
                  />
                </Field>
              </div>
            </Panel>

            <Panel
              title="Visibility"
              description="Control what other members can see."
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] text-faint">Changes apply immediately after saving.</span>
                  <Button size="sm" onClick={() => save("Profile")}>Save profile</Button>
                </div>
              }
            >
              <div className="space-y-4">
                <Toggle checked label="Public profile" onChange={() => {}} description="Allow anyone to view your streak history and verified evidence." />
                <div className="h-px bg-line-soft" />
                <Toggle checked label="Show commit messages" onChange={() => {}} description="Evidence labels are visible to group members. Repository names stay private." />
                <div className="h-px bg-line-soft" />
                <Toggle checked={false} label="Appear in global leaderboard" onChange={() => {}} description="You will still appear in your accountability groups." />
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-ink">Your profile</p>
                <Badge tone="green" className="text-[8.5px]">Live</Badge>
              </div>
              <div className="mt-3 rounded-xl border border-line bg-canvas/40 p-4 text-center">
                <Avatar person={currentUser} size="xl" className="mx-auto" />
                <p className="mt-2.5 text-[13px] font-semibold text-ink">{currentUser.name}</p>
                <p className="font-mono text-[10px] text-faint">@{currentUser.handle}</p>
                <div className="mt-3 grid grid-cols-3 divide-x divide-line-soft border-y border-line-soft py-2.5">
                  {[
                    { label: "Streak", value: `${currentUser.streak}d` },
                    { label: "Groups", value: groups.length },
                    { label: "Verified", value: 118 },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="number text-[12px] font-semibold text-ink">{s.value}</p>
                      <p className="text-[8.5px] uppercase tracking-wider text-faint">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-[9.5px] leading-relaxed text-faint">
                  Building consistently since June 2026. Evidence-backed commitments only.
                </p>
              </div>
              <button
                onClick={copyProfile}
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-line bg-card px-3 py-2 text-[10px] text-muted transition-colors hover:text-ink"
              >
                <span className="truncate font-mono">devstreak.app/@{currentUser.handle}</span>
                {profileUrlCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-accent-bright" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <a
                href={`https://devstreak.app/@${currentUser.handle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] text-faint hover:text-ink"
              >
                View public profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent-bright" />
                <p className="text-[11px] font-medium text-ink">Your data, your proof</p>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
                Verified evidence is immutable. Profile edits never rewrite streak history or
                previously verified commitments.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "preferences" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <Panel title="Appearance" description="Choose how DevStreak looks on this device.">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  {
                    id: "dark" as const,
                    label: "Dark",
                    desc: "Default. Easier for long coding sessions.",
                    icon: Moon,
                    preview: "bg-[#0B0F19] border-[#273449]",
                    bar: "bg-[#161E2E]",
                  },
                  {
                    id: "light" as const,
                    label: "Light",
                    desc: "High contrast for bright environments.",
                    icon: Sun,
                    preview: "bg-[#F7F8FA] border-[#E2E8F0]",
                    bar: "bg-white",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (theme !== t.id) toggleTheme();
                    }}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-all",
                      theme === t.id ? "border-accent/45 bg-accent/[0.04] ring-1 ring-accent/20" : "border-line hover:border-muted/40",
                    )}
                  >
                    <div className={cn("h-20 overflow-hidden rounded-lg border p-2", t.preview)}>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full bg-accent-bright/70")} />
                        <span className={cn("h-1 w-8 rounded-full bg-white/20")} />
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-1">
                        <div className={cn("col-span-2 h-8 rounded", t.bar)} />
                        <div className="space-y-1">
                          <div className={cn("h-3.5 rounded", t.bar)} />
                          <div className={cn("h-3.5 rounded", t.bar)} />
                        </div>
                      </div>
                      <div className="mt-1 h-2.5 w-2/3 rounded bg-accent-bright/25" />
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <t.icon className="h-3.5 w-3.5 text-muted" />
                      <span className="text-[12px] font-medium text-ink">{t.label}</span>
                      {theme === t.id && <Check className="ml-auto h-3.5 w-3.5 text-accent-bright" />}
                    </div>
                    <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{t.desc}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <Toggle
                  checked={compact}
                  onChange={setCompact}
                  label="Compact density"
                  description="Reduce spacing in lists and cards. Useful on smaller screens."
                />
              </div>
            </Panel>

            <Panel title="Locale & time" description="Used for deadlines, reminders and streak resets.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Language">
                  <Select defaultValue="en">
                    <option value="en">English (US)</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </Select>
                </Field>
                <Field label="Timezone">
                  <Select defaultValue="Europe/Berlin">
                    <option>Europe/Berlin</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                  </Select>
                </Field>
                <Field label="Week starts on">
                  <Select defaultValue="mon">
                    <option value="mon">Monday</option>
                    <option value="sun">Sunday</option>
                  </Select>
                </Field>
                <Field label="Time format">
                  <Select defaultValue="24">
                    <option value="24">24-hour</option>
                    <option value="12">12-hour</option>
                  </Select>
                </Field>
                <Field label="Day starts at" hint="Commitments reset at this time.">
                  <Select defaultValue="4">
                    <option value="0">00:00</option>
                    <option value="4">04:00</option>
                    <option value="6">06:00</option>
                  </Select>
                </Field>
                <Field label="Day ends at">
                  <Select defaultValue="23">
                    <option value="22">22:00</option>
                    <option value="23">23:00</option>
                    <option value="24">24:00</option>
                  </Select>
                </Field>
              </div>
              <div className="mt-4 space-y-4">
                <Toggle checked={weekends} onChange={setWeekends} label="Show weekends in streak calendar" description="Weekend days remain eligible for verification." />
              </div>
            </Panel>

            <Panel
              title="Planning defaults"
              description="These affect new commitments and how your day is presented."
              footer={
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => save("Preferences")}>Save preferences</Button>
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default commitment view">
                  <Select defaultValue="today">
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="all">All commitments</option>
                  </Select>
                </Field>
                <Field label="Daily planning reminder">
                  <Input type="time" defaultValue="08:30" />
                </Field>
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 text-blue" />
                <p className="text-[11.5px] font-semibold text-ink">Current local time</p>
              </div>
              <p className="number mt-2 text-2xl font-semibold text-ink">
                {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })}
              </p>
              <p className="mt-0.5 text-[10px] text-faint">Europe/Berlin · CET</p>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-canvas/40 px-2.5 py-2 text-[9.5px]">
                <span className="text-faint">Next reset</span>
                <span className="text-muted">in 6h 24m</span>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface/60 p-3.5">
              <div className="flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5 text-faint" />
                <p className="text-[11px] font-medium text-ink">This device</p>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-faint">
                Preferences are stored locally and synced to your account when you sign in.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-4">
          <Panel
            title="Notification channels"
            description="Choose where each type of update reaches you."
            footer={
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-faint">
                  <ShieldCheck className="h-3 w-3 text-accent-bright" /> Critical verification alerts cannot be disabled.
                </span>
                <Button size="sm" onClick={() => save("Notification")}>Save notifications</Button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-[1fr_repeat(3,56px)] items-center gap-2 border-b border-line-soft pb-2 text-[9px] font-medium uppercase tracking-wider text-faint">
                  <span>Notification type</span>
                  <span className="text-center">In-app</span>
                  <span className="text-center">Email</span>
                  <span className="text-center">Push</span>
                </div>
                {(
                  [
                    { key: "daily", label: "Daily commitment reminder", desc: "A nudge before your day ends" },
                    { key: "verification", label: "Verification results", desc: "When evidence qualifies or fails" },
                    { key: "group", label: "Group check-ins", desc: "When your group streak is at risk" },
                    { key: "partner", label: "Partner progress", desc: "Progress from your accountability partner" },
                    { key: "weekly", label: "Weekly report", desc: "Sunday summary and insights" },
                    { key: "product", label: "Product updates", desc: "New features and improvements" },
                  ] as const
                ).map((row) => {
                  const pref = notifPrefs[row.key];
                  return (
                    <div key={row.key} className="grid grid-cols-[1fr_repeat(3,56px)] items-center gap-2 border-b border-line-soft py-2.5 last:border-0">
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-medium text-ink">{row.label}</p>
                        <p className="text-[9.5px] text-faint">{row.desc}</p>
                      </div>
                      {(["inapp", "email", "push"] as const).map((channel) => (
                        <div key={channel} className="flex justify-center">
                          <MiniSwitch
                            label={`${row.label} via ${channel}`}
                            checked={pref[channel]}
                            onChange={(v) => {
                              if (row.key === "verification" && channel === "inapp") return;
                              setNotifPrefs((p) => ({ ...p, [row.key]: { ...p[row.key], [channel]: v } }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Quiet hours" description="Notifications are held and delivered after quiet hours end.">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-faint" />
                  <span className="text-[11.5px] text-muted">Do not disturb</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input type="time" defaultValue="22:00" className="h-8 w-[92px] text-[11px]" />
                  <span className="text-[10px] text-faint">to</span>
                  <Input type="time" defaultValue="07:30" className="h-8 w-[92px] text-[11px]" />
                </div>
              </div>
              <div className="mt-4">
                <Toggle checked label="Allow critical alerts during quiet hours" onChange={() => {}} description="Streak-at-risk warnings and failed verification still arrive." />
              </div>
            </Panel>

            <Panel title="Pause everything" description="Temporarily stop all non-critical notifications.">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-ink">Pause notifications</p>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-faint">
                    Useful during travel or deep work. Your streak is still tracked and verified.
                  </p>
                </div>
                <Toggle checked={pauseAll} onChange={setPauseAll} />
              </div>
              {pauseAll && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber/25 bg-amber/[0.05] px-2.5 py-2">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber" />
                  <p className="text-[9.5px] leading-relaxed text-muted">
                    Notifications are paused. Group members can still see your progress, and
                    commitments still need verification.
                  </p>
                </div>
              )}
            </Panel>
          </div>

          <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-canvas text-faint">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11.5px] font-medium text-ink">Email digest</p>
                <p className="text-[9.5px] text-faint">A single Sunday email with outcomes, not a stream of pings.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast({ tone: "success", title: "Test digest queued", description: "Check your inbox in a few minutes." })}>
              Send test digest
            </Button>
          </div>
        </div>
      )}

      {tab === "verification" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <Panel title="Evidence policy" description="How strict DevStreak is before counting a commitment as verified.">
              <div className="grid gap-2.5 sm:grid-cols-3">
                {[
                  { id: "strict", label: "Strict", desc: "Requires merged PR or qualifying repo activity.", badge: "Recommended" },
                  { id: "balanced", label: "Balanced", desc: "Commits, PRs or reviews can qualify.", badge: "Current" },
                  { id: "lenient", label: "Lenient", desc: "Manual confirmation allowed with a note.", badge: "Riskier" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPolicy(p.id)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-all",
                      policy === p.id ? "border-accent/45 bg-accent/[0.04] ring-1 ring-accent/20" : "border-line hover:border-muted/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-ink">{p.label}</span>
                      {policy === p.id && <Check className="h-3.5 w-3.5 text-accent-bright" />}
                    </div>
                    <p className="mt-1 text-[9.5px] leading-relaxed text-faint">{p.desc}</p>
                    <span className="mt-2 inline-block rounded border border-line px-1.5 py-0.5 text-[8px] text-faint">{p.badge}</span>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Qualifying activity" description="Select which signals can satisfy your commitment criteria.">
              <div className="space-y-2">
                {[
                  { key: "commits", label: "Commits", desc: "At least one commit on a monitored branch" },
                  { key: "prs", label: "Pull requests", desc: "A PR opened or updated against a monitored repo" },
                  { key: "reviews", label: "Code reviews", desc: "A submitted review with at least one comment" },
                  { key: "merges", label: "Merges", desc: "A PR merged into the default branch" },
                  { key: "discussions", label: "Discussions", desc: "Hugging Face discussion or issue replies" },
                ].map((e) => (
                  <label key={e.key} className="flex items-start gap-2.5 rounded-lg border border-line bg-canvas/35 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={evidence[e.key as keyof typeof evidence]}
                      onChange={(ev) => setEvidence((p) => ({ ...p, [e.key]: ev.target.checked }))}
                      className="mt-0.5 h-3.5 w-3.5 accent-emerald-500"
                    />
                    <span>
                      <span className="block text-[11px] font-medium text-ink">{e.label}</span>
                      <span className="block text-[9.5px] text-faint">{e.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Panel>

            <Panel
              title="Streak protection"
              description="Grace exists to absorb real life — not to hide missed work."
              footer={
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => save("Verification")}>Save verification rules</Button>
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Grace days per month">
                  <Select value={graceDays} onChange={(e) => setGraceDays(e.target.value)}>
                    <option value="0">None — strict</option>
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                  </Select>
                </Field>
                <Field label="Minimum evidence per day">
                  <Select defaultValue="1">
                    <option value="1">1 qualifying activity</option>
                    <option value="2">2 qualifying activities</option>
                    <option value="3">3 qualifying activities</option>
                  </Select>
                </Field>
              </div>
              <div className="mt-4 space-y-4">
                <Toggle
                  checked={autoProtect}
                  onChange={setAutoProtect}
                  label="Protect streak on integration outage"
                  description="If a connected source fails, affected days are marked pending instead of missed."
                />
                <div className="h-px bg-line-soft" />
                <Toggle
                  checked={manualVerify}
                  onChange={setManualVerify}
                  label="Allow manual verification"
                  description="Requires a written note and is visibly labeled as manual — never counted as source evidence."
                />
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <p className="text-[11.5px] font-semibold text-ink">How verification works</p>
              <div className="mt-3 space-y-3">
                {[
                  { n: "1", title: "Source task synchronized", desc: "Trello card marked done in a monitored board.", color: "bg-blue/15 text-blue border-blue/25" },
                  { n: "2", title: "Coding evidence detected", desc: "GitHub or Hugging Face activity matches criteria.", color: "bg-violet/15 text-violet border-violet/25" },
                  { n: "3", title: "Commitment verified", desc: "Only then does the day count toward your streak.", color: "bg-accent/15 text-accent-bright border-accent/25" },
                ].map((s) => (
                  <div key={s.n} className="flex gap-2.5">
                    <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold", s.color)}>
                      {s.n}
                    </span>
                    <div>
                      <p className="text-[10.5px] font-medium text-ink">{s.title}</p>
                      <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface/60 p-3.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-faint" />
                <p className="text-[11px] font-medium text-ink">Policy changes are forward-only</p>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
                Historical days keep the policy that was active when they were verified. Tightening
                rules cannot retroactively invalidate your streak.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber/25 bg-amber/[0.04] p-3.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
              <p className="text-[10px] leading-relaxed text-muted">
                Lenient and manual verification reduce proof quality. Groups using strict policies
                may exclude manually verified days.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "account" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="space-y-4">
            <Panel title="Account details" description="Used for sign-in, billing and critical alerts.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email address">
                  <Input type="email" defaultValue="alex@rivera.dev" />
                </Field>
                <Field label="Recovery email" optional>
                  <Input type="email" defaultValue="alex.rivera@gmail.com" />
                </Field>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-canvas/35 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-faint" />
                  <div>
                    <p className="text-[11px] font-medium text-ink">Password</p>
                    <p className="text-[9.5px] text-faint">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="secondary" size="xs" onClick={() => toast({ tone: "info", title: "Password reset sent", description: "Check your inbox for a secure link." })}>
                  Change
                </Button>
              </div>
            </Panel>

            <Panel title="Active sessions" description="Devices currently signed in to your account.">
              <div className="space-y-2">
                {[
                  { device: "Chrome on macOS", location: "Berlin, DE", current: true, icon: Laptop, last: "Active now" },
                  { device: "Safari on iPhone", location: "Berlin, DE", current: false, icon: Smartphone, last: "2 hours ago" },
                ].map((s) => (
                  <div key={s.device} className="flex items-center gap-3 rounded-lg border border-line bg-canvas/35 px-3 py-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-card text-faint">
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[11px] font-medium text-ink">{s.device}</p>
                        {s.current && <Badge tone="green" className="text-[8px]">This device</Badge>}
                      </div>
                      <p className="text-[9.5px] text-faint">{s.location} · {s.last}</p>
                    </div>
                    {!s.current && (
                      <Button variant="ghost" size="xs" onClick={() => toast({ tone: "success", title: "Session revoked", description: "That device has been signed out." })}>
                        <LogOut className="h-3 w-3" /> Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            <section className="overflow-hidden rounded-2xl border border-danger/30 bg-danger/[0.02]">
              <div className="border-b border-danger/20 px-5 py-4">
                <h2 className="text-[13.5px] font-semibold text-danger">Danger zone</h2>
                <p className="mt-0.5 text-[11.5px] text-faint">These actions are irreversible or affect your entire history.</p>
              </div>
              <div className="divide-y divide-line-soft">
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11.5px] font-medium text-ink">Export all data</p>
                    <p className="mt-0.5 text-[10px] text-faint">Commitments, evidence, groups and verification history as JSON.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => toast({ tone: "success", title: "Export started", description: "We'll email a download link when it's ready." })}>
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                </div>
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11.5px] font-medium text-ink">Reset streak</p>
                    <p className="mt-0.5 text-[10px] text-faint">Clears your current streak only. Verified history is preserved.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
                    <AlertTriangle className="h-3.5 w-3.5" /> Reset streak
                  </Button>
                </div>
                <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11.5px] font-medium text-danger">Delete account</p>
                    <p className="mt-0.5 text-[10px] text-faint">Permanently remove your profile, commitments and evidence.</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete account
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11.5px] font-semibold text-ink">Plan</p>
                <Badge tone="green" className="text-[8.5px]">Pro</Badge>
              </div>
              <p className="number mt-2 text-xl font-semibold text-ink">$8<span className="text-[11px] text-faint">/mo</span></p>
              <p className="mt-0.5 text-[9.5px] text-faint">Renews 12 December 2026</p>
              <div className="mt-3 space-y-1.5 text-[10px] text-muted">
                {["Unlimited commitments", "Unlimited groups", "Full verification history", "Priority support"].map((f) => (
                  <p key={f} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent-bright" /> {f}</p>
                ))}
              </div>
              <Button variant="secondary" size="xs" className="mt-3 w-full" onClick={() => toast({ tone: "info", title: "Billing portal", description: "Opening secure billing management." })}>
                Manage billing <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="rounded-xl border border-line bg-surface/60 p-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-bright" />
                <p className="text-[11px] font-medium text-ink">Data retention</p>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
                Verified evidence is retained for 18 months. Account deletion removes all personal
                data within 30 days, except anonymized streak statistics.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas/40 p-3.5">
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
              <p className="text-[10px] leading-relaxed text-faint">
                Need help? <span className="text-muted">support@devstreak.app</span> — we respond within one business day.
              </p>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset your current streak?"
        description="This cannot be undone for the current streak."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setResetOpen(false);
                toast({ tone: "error", title: "Streak reset", description: "Your current streak is now 0. Verified history is unchanged." });
              }}
            >
              Reset streak
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-amber/25 bg-amber/[0.05] p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <p className="text-[11.5px] leading-relaxed text-muted">
              Your <span className="font-semibold text-ink">{currentUser.streak}-day streak</span> will
              drop to zero. Past verified days and group history are preserved. Group streaks that
              depend on your daily completion are not affected retroactively.
            </p>
          </div>
          <p className="text-[10.5px] leading-relaxed text-faint">
            Most people reset after a deliberate break. If this is a temporary lapse, consider using
            a grace day instead.
          </p>
        </div>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteText("");
        }}
        title="Delete your account permanently?"
        description="This removes your profile, commitments, evidence and memberships."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteText("");
              }}
            >
              Keep my account
            </Button>
            <Button
              variant="danger"
              disabled={deleteText !== "DELETE"}
              onClick={() => {
                setDeleteOpen(false);
                setDeleteText("");
                toast({ tone: "error", title: "Deletion scheduled", description: "Your account will be removed in 7 days. Sign in to cancel." });
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-danger/25 bg-danger/[0.05] p-3">
            <p className="text-[11px] font-medium text-danger">This action affects every group you belong to.</p>
            <ul className="mt-2 space-y-1 text-[10.5px] leading-relaxed text-muted">
              <li>• {groups.length} group memberships will be removed.</li>
              <li>• 118 verified days and all linked evidence will be deleted.</li>
              <li>• Your public profile and leaderboard position disappear.</li>
            </ul>
          </div>
          <Field label="Type DELETE to confirm" hint="This is case-sensitive.">
            <Input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              className={cn(deleteText.length > 0 && deleteText !== "DELETE" && "border-danger/50 focus:ring-danger/15")}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
