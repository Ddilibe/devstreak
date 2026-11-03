import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { AuthHeading, AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(42);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [seconds]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const update = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setError("");
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length !== 6) {
      setError("Enter all six digits from the email.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => navigate("/onboarding"), 600);
  };

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-faint transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>

      <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-bright">
        <MailCheck className="h-5 w-5" />
      </span>
      <div className="mt-4">
        <AuthHeading
          title="Verify your email"
          subtitle={
            <>
              We sent a six-digit code to <span className="font-medium text-ink">alex@devstreak.app</span>.
              Enter it below to confirm your account.
            </>
          }
        />
      </div>

      <form onSubmit={submit}>
        <div className="flex gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
                if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
                if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-12 w-full rounded-xl border bg-surface text-center font-mono text-lg font-semibold text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent/15",
                error ? "border-danger/50 focus:border-danger" : "border-line focus:border-accent/60",
                digit && "border-accent/40",
              )}
            />
          ))}
        </div>

        {error && <p className="mt-2 text-[11px] text-danger">{error}</p>}

        <Button type="submit" variant="primary" className="mt-4 w-full" loading={loading}>
          {loading ? "Verifying…" : "Verify and continue"}
        </Button>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-surface/60 px-3 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] text-faint">
            <ShieldCheck className="h-3 w-3 text-accent-bright" />
            Codes expire after 10 minutes
          </span>
          {seconds > 0 ? (
            <span className="font-mono text-[10.5px] text-faint">
              Resend in 0:{seconds.toString().padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSeconds(60)}
              className="text-[10.5px] font-medium text-accent-bright hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-[11.5px] text-faint">
        Wrong address?{" "}
        <Link to="/register" className="font-medium text-accent-bright hover:underline">
          Start over
        </Link>
      </p>
    </AuthLayout>
  );
}
