import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  Check,
  Clock,
  Copy,
  Flame,
  Link2,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Overlay";
import { Field, Input, Select, Toggle } from "@/components/ui/Input";
import { GroupCard } from "@/components/accountability/GroupCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/context/AppContext";
import { groups as seedGroups, makeGroupHistory, people, personById } from "@/lib/data";
import type { Group } from "@/lib/types";
import { cn } from "@/lib/utils";

const emojiChoices = ["🚀", "🌙", "🌱", "⚡", "🧠", "🛠️", "🔥", "🧩"];

const partnerShared: Record<string, { streak: number; groups: string[] }> = {
  mira: { streak: 21, groups: ["Ship It Squad", "Open Source Guild"] },
  jonas: { streak: 21, groups: ["Ship It Squad"] },
  priya: { streak: 21, groups: ["Ship It Squad"] },
  sam: { streak: 6, groups: ["Night Owls", "Open Source Guild"] },
  lena: { streak: 6, groups: ["Night Owls", "Open Source Guild"] },
};

const pendingInvitations = [
  {
    id: "inv-1",
    group: "Weekend Builders",
    emoji: "⚡",
    from: "sam",
    members: 3,
    policy: "Majority (2 of 3)",
    timezone: "America/New_York",
    expires: "5 days",
  },
  {
    id: "inv-2",
    group: "ML Study Circle",
    emoji: "🧠",
    from: "priya",
    members: 4,
    policy: "All members",
    timezone: "Asia/Kolkata",
    expires: "2 days",
  },
];

function InvitePartnerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const link = "devstreak.app/join/alex-9f3k";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite an accountability partner"
      description="Partners see your daily completion status and streak health. Tasks and repository details stay private."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!email.trim()}
            onClick={() => {
              toast({ tone: "success", title: "Invitation sent", description: `${email} will receive an invite that expires in 7 days.` });
              setEmail("");
              onClose();
            }}
          >
            <Mail className="h-3.5 w-3.5" /> Send invite
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Email address">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@example.com"
            icon={<Mail className="h-3.5 w-3.5" />}
            autoFocus
          />
        </Field>
        <div className="rounded-xl border border-line bg-canvas/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">Invite link</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`https://${link}`).catch(() => {});
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-bright hover:underline"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-faint" />
            <code className="truncate font-mono text-[11px] text-muted">{link}</code>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-line bg-ink/[0.02] px-3 py-2.5">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-bright" />
          <p className="text-[10.5px] leading-relaxed text-faint">
            Invite links are single-use by default. You can revoke access at any time from partner settings.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function CreateGroupModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (group: Group) => void;
}) {
  const { toast } = useApp();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🚀");
  const [selected, setSelected] = useState<string[]>(["mira", "jonas"]);
  const [policy, setPolicy] = useState("all");
  const [grace, setGrace] = useState("1 grace day per month");
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const [notify, setNotify] = useState(true);
  const [atRisk, setAtRisk] = useState(true);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const create = () => {
    if (!name.trim() || selected.length === 0) return;
    const total = selected.length + 1;
    const group: Group = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      emoji,
      policy: policy === "all" ? "All members" : policy === "majority" ? "Majority" : "Custom",
      policyDetail:
        policy === "all"
          ? "Every member must meet their daily commitment."
          : "A majority of members must complete their commitments.",
      gracePeriod: grace,
      timezone,
      streak: 0,
      longest: 0,
      rate: 0,
      todayQualified: false,
      memberDone: 1,
      memberTotal: total,
      memberIds: ["alex", ...selected],
      qualificationNote: "New group — the first streak day begins when everyone completes a commitment.",
      history: makeGroupHistory(5),
    };
    onCreate(group);
    toast({ tone: "success", title: "Accountability group created", description: `${name} is ready. Your partners can join from the invite link.` });
    setName("");
    setSelected(["mira", "jonas"]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create an accountability group"
      description="Groups are independent. Their policy, timezone and grace period apply only to this streak."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={create} disabled={!name.trim() || selected.length === 0}>
            <Plus className="h-3.5 w-3.5" /> Create group
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-ink">Icon</label>
            <div className="grid h-10 w-[104px] grid-cols-4 gap-1 rounded-xl border border-line bg-surface p-1">
              {emojiChoices.slice(0, 8).map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "grid h-4 w-5 place-items-center rounded text-[10px] transition-colors",
                    emoji === e ? "bg-accent/15" : "hover:bg-ink/5",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <Field label="Group name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekend Builders" autoFocus />
            </Field>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-medium text-ink">Invite members</span>
            <span className="text-[10px] text-faint">{selected.length} selected</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {people.slice(1).map((p) => {
              const active = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors",
                    active ? "border-accent/40 bg-accent/[0.05]" : "border-line bg-card hover:border-faint/40",
                  )}
                >
                  <Avatar person={p} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium text-ink">{p.name}</span>
                    <span className="block truncate text-[9.5px] text-faint">@{p.handle}</span>
                  </span>
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border",
                      active ? "border-accent bg-accent text-white" : "border-line",
                    )}
                  >
                    {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          <Input className="mt-2" placeholder="Or invite by email…" icon={<Mail className="h-3.5 w-3.5" />} />
        </div>

        <div>
          <p className="mb-2 text-[12px] font-medium text-ink">Streak qualification policy</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { id: "all", title: "All members", desc: "Every member must complete their commitments." },
              { id: "majority", title: "Majority", desc: "More than half of members must complete." },
              { id: "custom", title: "Custom threshold", desc: "Define a specific number of members." },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPolicy(p.id)}
                className={cn(
                  "rounded-lg border p-2.5 text-left transition-colors",
                  policy === p.id ? "border-accent/40 bg-accent/[0.05]" : "border-line bg-card hover:border-faint/40",
                )}
              >
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink">
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full border",
                      policy === p.id ? "border-accent bg-accent" : "border-line",
                    )}
                  >
                    {policy === p.id && <span className="h-1 w-1 rounded-full bg-white" />}
                  </span>
                  {p.title}
                </span>
                <span className="mt-1 block pl-5 text-[9.5px] leading-relaxed text-faint">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Grace period" hint="One missed day can be forgiven without breaking the group streak.">
            <Select value={grace} onChange={(e) => setGrace(e.target.value)}>
              <option>No grace period</option>
              <option>1 grace day per month</option>
              <option>2 grace days per month</option>
              <option>1 grace day per quarter</option>
            </Select>
          </Field>
          <Field label="Group timezone" hint="The group day closes at midnight in this timezone.">
            <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option>Europe/Berlin</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Kolkata</option>
              <option>Asia/Tokyo</option>
            </Select>
          </Field>
        </div>

        <div className="card space-y-3 p-3.5">
          <Toggle
            checked={notify}
            onChange={setNotify}
            label="Notify me when members complete their commitments"
            description="Quiet progress updates, batched every 15 minutes."
          />
          <div className="h-px bg-line-soft" />
          <Toggle
            checked={atRisk}
            onChange={setAtRisk}
            label="Alert the group when the streak is at risk"
            description="Sent two hours before the group deadline if members are still pending."
          />
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas/60 px-3 py-2.5">
          <Bell className="h-3.5 w-3.5 text-faint" />
          <p className="flex-1 text-[10px] leading-relaxed text-faint">
            An invite link will be generated after creation. Your group policy can be changed later —
            history is preserved.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export function Accountability() {
  const { toast } = useApp();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [extraGroups, setExtraGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState(pendingInvitations);
  const [nudged, setNudged] = useState<string[]>([]);
  const allGroups = [...seedGroups, ...extraGroups];

  const accept = (id: string) => {
    const inv = invites.find((i) => i.id === id);
    setInvites((prev) => prev.filter((i) => i.id !== id));
    toast({ tone: "success", title: "Invitation accepted", description: inv ? `You joined ${inv.group}. Your first streak day starts today.` : undefined });
  };
  const decline = (id: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== id));
    toast({ tone: "info", title: "Invitation declined", description: "The invite link has been invalidated." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accountability"
        description="Partners and groups that keep you honest. Progress is shared — private tasks never are."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" /> Invite partner
            </Button>
            <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Create group
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Active partners", value: people.length - 1, icon: Users, tone: "text-ink", sub: "all connected" },
          { label: "Groups", value: allGroups.length, icon: ShieldCheck, tone: "text-blue", sub: "independent streaks" },
          { label: "Pending invites", value: invites.length, icon: Mail, tone: "text-amber", sub: "expiring soon" },
          { label: "Best shared streak", value: 41, icon: Flame, tone: "text-amber", sub: "Ship It Squad" },
        ].map((s) => (
          <div key={s.label} className="card px-3.5 py-3">
            <div className="flex items-center justify-between">
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-faint">{s.label}</p>
              <s.icon className={cn("h-3.5 w-3.5", s.tone)} />
            </div>
            <p className={cn("number mt-1.5 text-xl font-semibold", s.tone)}>{s.value}</p>
            <p className="truncate text-[9.5px] text-faint">{s.sub}</p>
          </div>
        ))}
      </div>

      {invites.length > 0 && (
        <section className="card overflow-hidden border-amber/25">
          <div className="flex items-center justify-between border-b border-line-soft bg-amber/[0.035] px-4 py-3">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-amber" />
              <h2 className="text-[12.5px] font-semibold text-ink">Pending invitations</h2>
              <Badge tone="amber" className="text-[9px]">{invites.length}</Badge>
            </div>
            <span className="text-[10px] text-faint">Review before they expire</span>
          </div>
          <div className="divide-y divide-line-soft">
            {invites.map((inv) => {
              const from = personById(inv.from);
              return (
                <div key={inv.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-elevated text-base">
                      {inv.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-ink">{inv.group}</p>
                      <p className="mt-0.5 text-[10.5px] text-faint">
                        Invited by <span className="text-muted">{from.name}</span> · {inv.members} members ·{" "}
                        {inv.policy}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[9.5px] text-faint">
                        <span className="inline-flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Expires in {inv.expires}</span>
                        <span>·</span>
                        <span>{inv.timezone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                    <Button variant="ghost" size="sm" onClick={() => decline(inv.id)}>
                      <X className="h-3.5 w-3.5" /> Decline
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => accept(inv.id)}>
                      <Check className="h-3.5 w-3.5" /> Accept
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          title="Your groups"
          description="Each group qualifies independently. A failure in one has no effect on the others."
          action={
            <div className="hidden items-center gap-1.5 sm:flex">
              <Badge tone="green" dot className="text-[9px]">{allGroups.filter((g) => g.todayQualified).length} qualified today</Badge>
              <Badge tone="amber" dot className="text-[9px]">{allGroups.filter((g) => !g.todayQualified).length} in progress</Badge>
            </div>
          }
        />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {allGroups.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
          <button
            onClick={() => setCreateOpen(true)}
            className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-ink/[0.015] p-5 text-center transition-colors hover:border-faint/50 hover:bg-ink/[0.03]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-faint">
              <Plus className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[12.5px] font-semibold text-ink">Create a group</p>
            <p className="mt-1 max-w-[200px] text-[10.5px] leading-relaxed text-faint">
              Invite multiple partners, choose a policy, grace period and timezone.
            </p>
          </button>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title="Accountability partners"
            description="People you share daily progress with across one or more groups."
          />
          <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Add partner
          </Button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {people.slice(1).map((p) => {
            const shared = partnerShared[p.id] ?? { streak: 0, groups: [] };
            const nudgedAlready = nudged.includes(p.id);
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar person={p} size="lg" status={p.today === "complete" ? "complete" : "pending"} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink">{p.name}</p>
                      <p className="truncate font-mono text-[10px] text-faint">@{p.handle}</p>
                      <Badge
                        tone={p.today === "complete" ? "green" : p.today === "in_progress" ? "blue" : p.today === "attention" ? "red" : "neutral"}
                        dot
                        className="mt-1 text-[8.5px]"
                      >
                        {p.today === "complete"
                          ? "Done today"
                          : p.today === "in_progress"
                            ? `${p.commitmentsTotal - p.commitmentsDone} left today`
                            : p.today === "attention"
                              ? "Needs attention"
                              : "Not started"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-baseline gap-1">
                      <Flame className="h-3 w-3 text-amber" fill="currentColor" fillOpacity={0.25} />
                      <span className="number text-[13px] font-semibold text-ink">{shared.streak}</span>
                    </div>
                    <p className="text-[8.5px] text-faint">shared days</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-faint">Today's commitments</span>
                    <span className="number text-muted">{p.commitmentsDone}/{p.commitmentsTotal}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: p.commitmentsTotal }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          i < p.commitmentsDone ? "bg-accent-bright" : "bg-ink/10",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {shared.groups.map((g) => (
                    <span key={g} className="rounded border border-line bg-ink/[0.025] px-1.5 py-0.5 text-[9px] text-faint">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-1.5 border-t border-line-soft pt-2.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setNudged((prev) => [...prev, p.id]);
                      toast({ tone: "success", title: `Nudge sent to ${p.name.split(" ")[0]}`, description: "A gentle reminder — no public callout." });
                    }}
                  >
                    <Bell className="h-3 w-3" /> {nudgedAlready ? "Nudged" : "Nudge"}
                  </Button>
                  <span className="flex-1" />
                  <Link
                    to="/activity"
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-faint transition-colors hover:text-ink"
                  >
                    Activity <ArrowUpRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            );
          })}
          {people.length - 1 === 0 && (
            <EmptyState
              icon={UserPlus}
              title="No partners yet"
              description="Invite someone you trust to show up. Accountability works best with people who notice."
              action={<Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>Invite a partner</Button>}
            />
          )}
        </div>
      </section>

      <div className="card flex flex-col items-start justify-between gap-4 overflow-hidden p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-gradient-to-br from-accent/15 to-transparent text-accent-bright">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-ink">Accountability works better in a group</p>
            <p className="mt-0.5 max-w-md text-[11px] leading-relaxed text-muted">
              Shared ownership raises follow-through. Groups can be small (2–3) or up to 5 members,
              each with their own policy and timezone.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Create another group
        </Button>
      </div>

      <InvitePartnerModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(g) => setExtraGroups((prev) => [...prev, g])}
      />
    </div>
  );
}
