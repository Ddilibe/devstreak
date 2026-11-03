import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  GitBranch,
  GitMerge,
  Github,
  Layers,
  Lock,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { GithubIcon, HuggingFaceIcon, TrelloIcon } from "@/components/brand/BrandIcons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Heatmap } from "@/components/streak/Heatmap";
import { StreakFlame } from "@/components/streak/StreakFlame";
import { currentUser, people } from "@/lib/data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Why DevStreak", href: "#why" },
  { label: "How it works", href: "#how" },
  { label: "Accountability", href: "#accountability" },
  { label: "Integrations", href: "#integrations" },
];

function Nav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="DevStreak home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-canvas px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-[13px] font-medium text-muted hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link to="/login" className="block rounded-lg px-2 py-2.5 text-[13px] font-medium text-muted hover:text-ink">
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 rounded-[32px] bg-gradient-to-tr from-accent/20 via-blue/10 to-transparent blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 border-b border-line bg-elevated/60 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger/60" />
            <span className="h-2 w-2 rounded-full bg-amber/60" />
            <span className="h-2 w-2 rounded-full bg-accent/60" />
          </span>
          <span className="mx-auto rounded-md border border-line bg-canvas/60 px-4 py-0.5 font-mono text-[8.5px] text-faint">
            devstreak.app/dashboard
          </span>
          <Lock className="h-2.5 w-2.5 text-faint" />
        </div>

        <div className="flex">
          <div className="hidden w-[128px] shrink-0 border-r border-line-soft bg-canvas/40 p-2.5 sm:block">
            <div className="flex items-center gap-1.5 px-1">
              <LogoMark className="h-4 w-4" />
              <span className="text-[9.5px] font-bold text-ink">DevStreak</span>
            </div>
            <div className="mt-3 space-y-0.5">
              {["Overview", "My Tasks", "My Streaks", "Accountability", "Activity", "Integrations"].map(
                (item, i) => (
                  <div
                    key={item}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[8.5px]",
                      i === 0 ? "bg-accent/10 text-ink" : "text-faint",
                    )}
                  >
                    <span className={cn("h-1 w-1 rounded-full", i === 0 ? "bg-accent-bright" : "bg-faint/50")} />
                    {item}
                  </div>
                ),
              )}
            </div>
            <div className="mt-4 rounded-lg border border-amber/20 bg-amber/[0.05] p-2">
              <div className="flex items-center gap-1 text-[8px] text-amber">
                <Flame className="h-2.5 w-2.5" /> Current streak
              </div>
              <p className="mt-0.5 font-mono text-[15px] font-semibold text-ink">12 days</p>
            </div>
          </div>

          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-ink">Good evening, Alex</p>
                <p className="text-[8px] text-faint">Tuesday, 18 November · 3 of 5 commitments complete</p>
              </div>
              <div className="flex -space-x-1.5">
                {people.slice(1, 4).map((p) => (
                  <Avatar key={p.id} person={p} size="xs" ring className="h-4 w-4 text-[6px]" />
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                { label: "Personal", value: "12", icon: Flame, tone: "text-amber" },
                { label: "Best", value: "34", icon: Star, tone: "text-blue" },
                { label: "Group", value: "21", icon: Users, tone: "text-accent-bright" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-line bg-canvas/40 p-2">
                  <s.icon className={cn("h-2.5 w-2.5", s.tone)} />
                  <p className="mt-1 font-mono text-[14px] font-semibold leading-none text-ink">{s.value}</p>
                  <p className="mt-0.5 text-[7px] uppercase tracking-wider text-faint">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-lg border border-line bg-canvas/40 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[8.5px] font-semibold text-ink">Today's commitments</span>
                <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[7px] font-medium text-accent-bright">
                  3 verified
                </span>
              </div>
              <div className="mt-1.5 space-y-1.5">
                {[
                  { title: "Fix checkout integration test", state: "Verified", tone: "green" },
                  { title: "Ship token refresh middleware", state: "Activity detected", tone: "violet" },
                  { title: "Document streak logic", state: "Needs attention", tone: "red" },
                ].map((t) => (
                  <div key={t.title} className="flex items-center gap-2 rounded-md border border-line-soft bg-surface px-2 py-1.5">
                    <GithubIcon className="h-2.5 w-2.5 text-ink" />
                    <span className="flex-1 truncate text-[8px] text-muted">{t.title}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[6.5px] font-medium",
                        t.tone === "green" && "bg-accent/10 text-accent-bright",
                        t.tone === "violet" && "bg-violet/10 text-violet",
                        t.tone === "red" && "bg-danger/10 text-danger",
                      )}
                    >
                      {t.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-[1.2fr_1fr] gap-1.5">
              <div className="rounded-lg border border-line bg-canvas/40 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-semibold text-ink">Streak calendar</span>
                  <span className="text-[6.5px] text-faint">Nov</span>
                </div>
                <div className="mt-1.5 grid grid-cols-7 gap-[3px]">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "aspect-square rounded-[2px]",
                        i < 17 && (i + 3) % 11 !== 0
                          ? i > 16
                            ? "bg-accent/20"
                            : "bg-emerald-400/60"
                          : i === 17
                            ? "bg-amber/50"
                            : "bg-ink/[0.05]",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-canvas/40 p-2.5">
                <div className="flex items-center gap-1 text-[8px] font-semibold text-ink">
                  🚀 Ship It Squad
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <Flame className="h-3 w-3 text-amber" />
                  <span className="font-mono text-[15px] font-semibold text-ink">21</span>
                  <span className="text-[6.5px] text-faint">days</span>
                </div>
                <div className="mt-1.5 flex -space-x-1">
                  {people.slice(0, 4).map((p) => (
                    <Avatar key={p.id} person={p} size="xs" ring className="h-3.5 w-3.5 text-[5.5px]" />
                  ))}
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-3/4 rounded-full bg-amber" />
                </div>
                <p className="mt-1 text-[6.5px] text-amber">3 of 4 complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 top-24 hidden animate-fade-in-up rounded-xl border border-accent/30 bg-elevated/95 p-2.5 shadow-lift backdrop-blur animate-delay-300 sm:block lg:-right-6">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent/15 text-accent-bright">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[9px] font-semibold text-ink">Commitment verified</p>
            <p className="text-[7.5px] text-faint">PR #281 merged · GitHub</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-2 hidden animate-fade-in-up items-center gap-2 rounded-xl border border-line bg-elevated/95 p-2.5 shadow-lift backdrop-blur animate-delay-500 sm:flex lg:-left-6">
        <StreakFlame size="sm" />
        <div>
          <p className="text-[7.5px] uppercase tracking-wider text-faint">Group streak</p>
          <p className="text-[10px] font-semibold text-ink">21 days · qualified</p>
        </div>
        <Badge tone="green" dot className="ml-1 text-[7px]">
          Live
        </Badge>
      </div>
    </div>
  );
}

const conceptCards = [
  {
    step: "01",
    title: "Task synchronized",
    icon: TrelloIcon,
    tone: "blue",
    copy: "A card exists in Trello and is mirrored into DevStreak. Syncing is not proof of work.",
    example: "Trello · Done",
  },
  {
    step: "02",
    title: "Activity verified",
    icon: GitBranch,
    tone: "violet",
    copy: "DevStreak detects commits, PRs and repo updates tied to the task's repository.",
    example: "GitHub · 3 commits",
  },
  {
    step: "03",
    title: "Commitment completed",
    icon: ShieldCheck,
    tone: "green",
    copy: "Your predefined evidence rule is satisfied. Only then does the day count toward your streak.",
    example: "PR merged · counts",
  },
];

const steps = [
  {
    n: "1",
    title: "Connect your tools",
    copy: "Link Trello, GitHub and Hugging Face in under two minutes. Granular scopes, revoke anytime.",
  },
  {
    n: "2",
    title: "Commit to today",
    copy: "Turn synchronized tasks into daily commitments with clear completion criteria and evidence rules.",
  },
  {
    n: "3",
    title: "Do the work",
    copy: "DevStreak watches your repositories and verifies qualifying activity automatically. No self-reporting.",
  },
  {
    n: "4",
    title: "Keep each other honest",
    copy: "Your accountability groups see progress, not private tasks. Independent streaks keep pressure fair.",
  },
];

export function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DevStreak — Build consistently. Stay accountable.";
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <Nav />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15">
                <Sparkles className="h-2.5 w-2.5 text-accent-bright" />
              </span>
              Consistency infrastructure for developers
              <ChevronRight className="h-3 w-3 text-faint" />
            </div>

            <h1 className="mt-5 text-[40px] font-bold leading-[1.03] tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[62px]">
              Build consistently.
              <br />
              <span className="text-gradient">Stay accountable.</span>
            </h1>

            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-muted sm:text-[15.5px]">
              DevStreak turns daily coding into a verified streak. Sync your tasks, prove the work
              through real repository activity, and keep the streak alive with partners who are
              counting on you.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button variant="primary" size="lg" onClick={() => navigate("/register")} className="group">
                Start your streak
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                <Play className="h-3.5 w-3.5" />
                Explore the demo
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-faint">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-accent-bright" /> Free for solo developers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3 w-3 text-accent-bright" /> No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-accent-bright" /> Read-only integrations
              </span>
            </div>

            <div className="mt-9 flex items-center gap-4 border-t border-line-soft pt-5">
              <div className="flex -space-x-2">
                {people.slice(0, 5).map((p) => (
                  <Avatar key={p.id} person={p} size="sm" ring />
                ))}
              </div>
              <p className="text-[11.5px] leading-snug text-muted">
                <span className="font-semibold text-ink">2,400+ developers</span> shipped with intent
                this month.
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-150">
            <HeroPreview />
          </div>
        </div>

        <div className="relative border-y border-line bg-surface/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
              Verifiable activity from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-10">
              {[
                { name: "GitHub", icon: GithubIcon },
                { name: "Trello", icon: TrelloIcon },
                { name: "Hugging Face", icon: HuggingFaceIcon },
              ].map((b) => (
                <span key={b.name} className="inline-flex items-center gap-2 text-faint transition-colors hover:text-ink">
                  <b.icon className="h-5 w-5" />
                  <span className="text-[13px] font-semibold tracking-tight">{b.name}</span>
                </span>
              ))}
              <span className="hidden items-center gap-2 border-l border-line pl-7 text-faint sm:inline-flex">
                <GitMerge className="h-4 w-4" />
                <span className="text-[11px]">+ GitLab soon</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-bright">
            Completion isn't proof
          </p>
          <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[36px]">
            A checked box is not a streak.
            <br />
            <span className="text-muted">Verified work is.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted">
            Most habit trackers trust you to tell the truth. DevStreak treats task sync, coding
            evidence and commitment completion as three separate things — because they are.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {conceptCards.map((c) => (
            <div key={c.title} className="card relative overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl border",
                    c.tone === "blue" && "border-blue/25 bg-blue/10 text-blue",
                    c.tone === "violet" && "border-violet/25 bg-violet/10 text-violet",
                    c.tone === "green" && "border-accent/25 bg-accent/10 text-accent-bright",
                  )}
                >
                  <c.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] text-faint">{c.step}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-ink">{c.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{c.copy}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3">
                <span className="font-mono text-[10px] text-faint">{c.example}</span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    c.tone === "blue" && "bg-blue",
                    c.tone === "violet" && "bg-violet",
                    c.tone === "green" && "bg-accent-bright",
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber/20 bg-amber/[0.04] px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
          <p className="text-[12px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">Why it matters:</span> if a Trello card is
            marked done but no qualifying commit, PR or repository update is detected, DevStreak
            flags the commitment as <span className="font-medium text-danger">needs attention</span> —
            not complete. Integrity is the product.
          </p>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue">How it works</p>
              <h2 className="mt-2 text-[28px] font-bold tracking-[-0.025em] text-ink sm:text-[34px]">
                From task to verified streak
              </h2>
            </div>
            <p className="max-w-sm text-[12.5px] leading-relaxed text-muted">
              Set it up once. DevStreak handles synchronization, verification and accountability in
              the background.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative card p-5">
                <span className="number grid h-8 w-8 place-items-center rounded-lg border border-line bg-elevated text-[12px] font-semibold text-ink">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[14px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{s.copy}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-faint lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="accountability" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet">Accountability</p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[36px]">
              Someone else is
              <br />
              counting on you.
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
              Join independent accountability groups with their own policies and timezones. A
              failure in one group never breaks a streak in another.
            </p>

            <div className="mt-7 space-y-3">
              {[
                {
                  icon: Users,
                  title: "Multiple independent groups",
                  copy: "Ship It Squad, Night Owls, your open-source crew. Each streak is calculated separately.",
                },
                {
                  icon: ShieldCheck,
                  title: "Transparent qualification",
                  copy: "Every day tells you exactly why a group qualified or missed — who was pending, what policy applied.",
                },
                {
                  icon: Zap,
                  title: "Grace, not guilt",
                  copy: "Configure grace periods and timezones so life happens without silently killing momentum.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 rounded-xl border border-line bg-card/60 p-3.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-elevated text-violet">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[12.5px] font-semibold text-ink">{f.title}</h3>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{f.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-violet/[0.06] blur-2xl" />
            <div className="relative space-y-3">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-elevated text-lg">🚀</span>
                    <div>
                      <p className="text-[13px] font-semibold text-ink">Ship It Squad</p>
                      <p className="text-[10px] text-faint">All members · Europe/Berlin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-baseline gap-1">
                      <Flame className="h-3.5 w-3.5 text-amber" fill="currentColor" fillOpacity={0.25} />
                      <span className="number text-lg font-semibold text-ink">21</span>
                      <span className="text-[9px] text-faint">days</span>
                    </div>
                    <p className="text-[9px] text-amber">3 of 4 complete</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {people.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg border border-line-soft px-2.5 py-1.5">
                      <Avatar person={p} size="xs" />
                      <span className="flex-1 text-[10.5px] font-medium text-muted">{p.name}</span>
                      <span className="text-[9px] text-faint">
                        {p.commitmentsDone}/{p.commitmentsTotal}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[8px] font-medium",
                          p.today === "complete" && "bg-accent/10 text-accent-bright",
                          p.today === "in_progress" && "bg-blue/10 text-blue",
                          p.today === "pending" && "bg-ink/[0.06] text-faint",
                        )}
                      >
                        {p.today === "complete" ? "Complete" : p.today === "in_progress" ? "2 left" : "Not started"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber/20 bg-amber/[0.05] px-2.5 py-2">
                  <Flame className="h-3.5 w-3.5 text-amber" />
                  <p className="text-[9.5px] leading-relaxed text-muted">
                    Streak continues if Jonas completes 2 remaining commitments by 23:59 Berlin time.
                  </p>
                </div>
              </div>

              <div className="card flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-elevated text-base">🌙</span>
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">Night Owls</p>
                    <p className="text-[9.5px] text-faint">Independent streak · 6 days</p>
                  </div>
                </div>
                <Badge tone="green" dot className="text-[9px]">
                  Majority qualified
                </Badge>
              </div>

              <div className="ml-6 rounded-xl border border-line bg-card p-3.5">
                <div className="flex items-center gap-2">
                  <TwitterLike />
                  <p className="text-[10px] leading-relaxed text-muted">
                    <span className="font-semibold text-ink">Mira</span> completed 4 commitments.
                    <span className="ml-1 text-accent-bright">Verified by GitHub.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber">Streak integrity</p>
              <h2 className="mt-2 text-[28px] font-bold tracking-[-0.025em] text-ink sm:text-[34px]">
                Momentum you can see
              </h2>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
                A 365-day view of your consistency. Missed days are shown honestly, not hidden.
                Milestones at 7, 30, 60, 100 and 365 days give you something real to protect.
              </p>
              <div className="mt-6 grid max-w-sm grid-cols-3 gap-2">
                {[
                  { label: "Current streak", value: "12", tone: "text-amber" },
                  { label: "Longest streak", value: "34", tone: "text-blue" },
                  { label: "Completion rate", value: "91%", tone: "text-accent-bright" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-card p-3">
                    <p className={cn("number text-xl font-semibold", s.tone)}>{s.value}</p>
                    <p className="mt-0.5 text-[9.5px] leading-tight text-faint">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StreakFlame size="sm" />
                  <div>
                    <p className="text-[12px] font-semibold text-ink">Personal streak</p>
                    <p className="text-[10px] text-faint">Last 18 weeks</p>
                  </div>
                </div>
                <Badge tone="amber" className="text-[9px]">🔥 12 days</Badge>
              </div>
              <div className="mt-4">
                <Heatmap days={126} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="integrations" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue">Integrations</p>
          <h2 className="mt-2 text-[28px] font-bold tracking-[-0.025em] text-ink sm:text-[34px]">
            Works with how you already ship
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-muted">
            Read-only connections. Pick exactly which boards and repositories DevStreak can observe.
          </p>
        </div>

        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {[
            {
              name: "Trello",
              icon: TrelloIcon,
              tag: "Task source",
              copy: "Boards, lists, cards, deadlines and assignments sync into your daily commitments.",
              items: ["Board-level scoping", "Status synchronization", "Webhook updates"],
              tone: "text-[#2E9BE6] border-blue/20 bg-blue/[0.06]",
            },
            {
              name: "GitHub",
              icon: GithubIcon,
              tag: "Evidence source",
              copy: "Commits, branches, pull requests, reviews and merges become verifiable activity.",
              items: ["Repo-level scoping", "PR & review tracking", "Read-only webhooks"],
              tone: "text-ink border-line bg-ink/[0.03]",
            },
            {
              name: "Hugging Face",
              icon: HuggingFaceIcon,
              tag: "Evidence source",
              copy: "Model repositories, dataset updates, commits and discussions count as evidence.",
              items: ["Model & dataset repos", "Commit detection", "Discussion activity"],
              tone: "text-amber border-amber/20 bg-amber/[0.05]",
            },
          ].map((i) => (
            <div key={i.name} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <span className={cn("grid h-10 w-10 place-items-center rounded-xl border", i.tone)}>
                  <i.icon className="h-5 w-5" />
                </span>
                <Badge tone="neutral" className="text-[9px]">{i.tag}</Badge>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-ink">{i.name}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{i.copy}</p>
              <ul className="mt-3 space-y-1.5">
                {i.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[11px] text-muted">
                    <Check className="h-3 w-3 text-accent-bright" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 surface-grid opacity-20" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[500px] -translate-x-1/2 rounded-full bg-accent/15 blur-[80px]" />
          <div className="relative">
            <StreakFlame size="lg" className="mx-auto" />
            <h2 className="mx-auto mt-5 max-w-xl text-[28px] font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[38px]">
              The streak starts with one honest day.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-muted">
              Set up in two minutes. Bring your tasks, your repositories and the people who will
              notice when you don't show up.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Button variant="primary" size="lg" onClick={() => navigate("/register")} className="group w-full sm:w-auto">
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
                Explore the live demo
              </Button>
            </div>
            <p className="mt-4 text-[10.5px] text-faint">
              Free forever for solo developers · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                Consistency infrastructure for developers who intend to keep shipping.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10.5px] text-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                All systems operational
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Product",
                  links: ["Overview", "Tasks", "Streaks", "Accountability", "Analytics"],
                },
                {
                  title: "Integrations",
                  links: ["Trello", "GitHub", "Hugging Face", "Changelog"],
                },
                {
                  title: "Company",
                  links: ["About", "Privacy", "Terms", "Contact"],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">{col.title}</p>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((l) => (
                      <li key={l}>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-1 text-[11.5px] text-muted transition-colors hover:text-ink"
                        >
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line-soft pt-6 sm:flex-row">
            <p className="text-[10.5px] text-faint">© 2026 DevStreak. Built for people who ship.</p>
            <div className="flex items-center gap-3 text-faint">
              <Github className="h-4 w-4" />
              <span className="font-mono text-[10px]">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TwitterLike() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet/10 text-violet">
      <Users className="h-3 w-3" />
    </span>
  );
}

export function LandingPreviewBadge() {
  const [count] = useState(2400);
  return <span>{count}</span>;
}

export const _landingHelpers = { currentUser, ArrowUpRight, Layers, Star };
