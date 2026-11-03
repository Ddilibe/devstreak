import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthDivider, AuthHeading, AuthLayout, OAuthButtons } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@devstreak.app");
  const [password, setPassword] = useState("devstreak");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => navigate("/dashboard"), 700);
  };

  return (
    <AuthLayout>
      <AuthHeading
        title="Welcome back"
        subtitle="Pick up your streak where you left off. Your commitments are waiting."
      />

      <OAuthButtons mode="login" />
      <AuthDivider />

      <form onSubmit={submit} className="space-y-3.5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-ink">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="h-3.5 w-3.5" />}
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-[12px] font-medium text-ink">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] font-medium text-muted transition-colors hover:text-accent-bright">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
        </div>

        {error && (
          <p className="rounded-lg border border-danger/25 bg-danger/[0.06] px-2.5 py-2 text-[11px] text-danger">
            {error}
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-muted">
          <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-emerald-500" />
          Keep me signed in on this device
        </label>

        <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      <div className="mt-4 rounded-xl border border-line bg-surface/60 px-3 py-2.5">
        <p className="text-[10.5px] leading-relaxed text-faint">
          <span className="font-medium text-muted">Design demo:</span> any email and password works.
          Use the pre-filled credentials to explore the full dashboard.
        </p>
      </div>

      <p className="mt-6 text-center text-[12px] text-muted">
        New to DevStreak?{" "}
        <Link to="/register" className="font-medium text-accent-bright hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
