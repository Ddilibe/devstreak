import { Link } from "react-router-dom";
import { ArrowLeft, Check, Flame, GitMerge, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GithubIcon } from "@/components/brand/BrandIcons";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Heatmap } from "@/components/streak/Heatmap";
import { StreakFlame } from "@/components/streak/StreakFlame";
import { people } from "@/lib/data";

export function AuthLayout({
  children,
  alternate,
}: {
  children: React.ReactNode;
  alternate?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[1fr_1.02fr]">
      <div className="flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="DevStreak home">
            <Logo />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11.5px] font-medium text-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            View demo <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-[370px] animate-fade-in-up">{children}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-faint sm:justify-start">
          <span>© 2026 DevStreak</span>
          <Link to="/" className="hover:text-muted">Privacy</Link>
          <Link to="/" className="hover:text-muted">Terms</Link>
          <span className="inline-flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-accent-bright" /> All systems operational
          </span>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-line bg-surface lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-16">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-accent/[0.10] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue/[0.08] blur-[90px]" />

        <div className="relative">
          <Badge tone="green" dot className="mb-6">
            Consistency infrastructure
          </Badge>
          <h2 className="max-w-md text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            Proof, not promises.
          </h2>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted">
            Your streak is built from verified repository activity — commits, merges, reviews and
            repo updates — not from checking a box.
          </p>

          <div className="mt-8 max-w-md space-y-3">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <StreakFlame size="md" />
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">Personal streak</p>
                    <p className="text-[10px] text-faint">Last 18 weeks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="number text-lg font-semibold text-amber">12</p>
                  <p className="text-[9.5px] text-faint">days</p>
                </div>
              </div>
              <div className="mt-3">
                <Heatmap days={126} showLegend={false} />
              </div>
            </div>

            <div className="card flex items-center gap-3 p-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent-bright">
                <Check className="h-4 w-4" strokeWidth={2.6} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-medium text-ink">Commitment verified</p>
                <p className="truncate text-[10px] text-faint">PR #281 merged · devstreak/web-app</p>
              </div>
              <span className="font-mono text-[9px] text-faint">4m</span>
            </div>

            <div className="card flex items-center gap-3 p-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-violet/25 bg-violet/10 text-violet">
                <GitMerge className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-medium text-ink">Mira completed her commitments</p>
                <p className="text-[10px] text-faint">Ship It Squad · 3 of 4 complete</p>
              </div>
              <div className="flex -space-x-1.5">
                {people.slice(0, 3).map((p) => (
                  <Avatar key={p.id} person={p} size="xs" ring className="h-5 w-5 text-[7px]" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-5 text-[10px] text-faint">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-bright" /> Read-only by default
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GithubIcon className="h-3.5 w-3.5" /> GitHub, Trello, Hugging Face
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber" /> 2,400+ developers
            </span>
          </div>

          {alternate}
        </div>
      </div>
    </div>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-[24px] font-semibold tracking-[-0.025em] text-ink">{title}</h1>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{subtitle}</p>
    </div>
  );
}

export function OAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const label = mode === "login" ? "Continue with" : "Sign up with";
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[12.5px] font-medium text-ink transition-colors hover:border-faint/50 hover:bg-elevated">
        <GithubIcon className="h-4 w-4" />
        GitHub
      </button>
      <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-[12.5px] font-medium text-ink transition-colors hover:border-faint/50 hover:bg-elevated">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.4h6.5c-.1 1.1-.8 2.7-2.3 3.8l3.5 2.7c2.1-1.9 3.8-4.8 3.8-8.6Z" />
          <path fill="#34A853" d="M12 24c3.3 0 6-1.1 8-3l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-4 3.1C3.1 21.3 7.2 24 12 24Z" />
          <path fill="#FBBC05" d="M5.1 14.2c-.3-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.1 6.7C.4 8.3 0 10.1 0 12s.4 3.7 1.1 5.3l4-3.1Z" />
          <path fill="#EA4335" d="M12 4.8c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.3 0 12 0 7.2 0 3.1 2.7 1.1 6.7l4 3.1c1-2.9 3.7-5 6.9-5Z" />
        </svg>
        Google
      </button>
      <p className="sr-only">{label} an external account</p>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="text-[10px] font-medium uppercase tracking-wider text-faint">or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
