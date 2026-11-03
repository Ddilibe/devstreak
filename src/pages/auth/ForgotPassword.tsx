import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { AuthHeading, AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (sent) {
    return (
      <AuthLayout>
        <div className="animate-fade-in-up">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-bright">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.025em] text-ink">Check your inbox</h1>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            If an account exists for <span className="font-medium text-ink">{email}</span>, we sent a
            password reset link. It expires in 30 minutes.
          </p>
          <div className="mt-5 rounded-xl border border-line bg-surface/60 px-3.5 py-3">
            <p className="text-[10.5px] leading-relaxed text-faint">
              Didn't get the email? Check your spam folder or make sure you entered the right address.
            </p>
          </div>
          <div className="mt-6 space-y-2.5">
            <Button variant="primary" className="w-full" onClick={() => setSent(false)}>
              Try another email
            </Button>
            <Link
              to="/login"
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl text-[12px] font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-faint transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
      <AuthHeading
        title="Reset your password"
        subtitle="Enter the email associated with your DevStreak account and we'll send you a reset link."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          window.setTimeout(() => {
            setLoading(false);
            setSent(true);
          }, 600);
        }}
        className="space-y-3.5"
      >
        <div>
          <label htmlFor="reset-email" className="mb-1.5 block text-[12px] font-medium text-ink">
            Email
          </label>
          <Input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-3.5 w-3.5" />}
            required
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          {loading ? "Sending link…" : "Send reset link"}
          {!loading && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>
      <p className="mt-6 text-center text-[11.5px] leading-relaxed text-faint">
        For security, reset links are single-use and expire after 30 minutes.
      </p>
    </AuthLayout>
  );
}
