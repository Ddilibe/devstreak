import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { AuthDivider, AuthHeading, AuthLayout, OAuthButtons } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = ["Too short", "Weak", "Fair", "Strong", "Excellent"][strength];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => navigate("/onboarding"), 700);
  };

  return (
    <AuthLayout>
      <AuthHeading
        title="Create your account"
        subtitle="Start building a verified streak today. Free for solo developers."
      />

      <OAuthButtons mode="signup" />
      <AuthDivider />

      <form onSubmit={submit} className="space-y-3.5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[12px] font-medium text-ink">
            Full name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            icon={<User className="h-3.5 w-3.5" />}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-ink">
            Work email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="h-3.5 w-3.5" />}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[12px] font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-10 text-[13.5px] text-ink transition-colors placeholder:text-faint focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-faint transition-colors hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strength
                        ? strength <= 2
                          ? "bg-amber"
                          : "bg-accent-bright"
                        : "bg-ink/10",
                    )}
                  />
                ))}
              </div>
              <span className="w-14 text-right text-[10px] text-faint">{strengthLabel}</span>
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-emerald-500"
          />
          <span>
            I agree to the{" "}
            <Link to="/" className="text-accent-bright hover:underline">Terms of Service</Link> and{" "}
            <Link to="/" className="text-accent-bright hover:underline">Privacy Policy</Link>.
          </span>
        </label>

        <Button type="submit" variant="primary" size="md" className="w-full" loading={loading} disabled={!terms}>
          {loading ? "Creating account…" : "Create account"}
          {!loading && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-surface/60 px-3 py-2.5">
        <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-bright" />
        <p className="text-[10.5px] leading-relaxed text-faint">
          You'll choose integrations and invite partners in a short, skippable setup. No repository
          access is granted until you approve it.
        </p>
      </div>

      <p className="mt-6 text-center text-[12px] text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent-bright hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
