"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const hasSetupData = typeof window !== "undefined" && sessionStorage.getItem("interviewSetup");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setShowVerification(true);
      setLoading(false);
    }
  };

  const handleVerified = async () => {
    setVerifyLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Email not confirmed"
          ? "Your email hasn't been verified yet. Please check your inbox and click the verification link first."
          : error.message
      );
      setVerifyLoading(false);
    } else {
      const interviewSetup = sessionStorage.getItem("interviewSetup");
      const pendingSave = sessionStorage.getItem("pendingSave");

      if (interviewSetup) {
        router.push("/interview");
      } else if (pendingSave) {
        router.push("/scorecard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="font-display text-xl font-semibold text-ink"
            >
              InterviewPreview
            </Link>
          </div>

          <Card padding="lg">
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-semibold text-ink mb-3">
                Check your email
              </h1>
              <p className="text-sm text-ink-secondary mb-2">
                We sent a verification link to
              </p>
              <p className="text-sm font-medium text-ink mb-6">{email}</p>
              <p className="text-sm text-ink-secondary mb-6">
                Click the link in your email to verify your account. Once
                verified, come back here and continue.
              </p>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-btn p-3 mb-4">
                  {error}
                </div>
              )}

              <Button
                onClick={handleVerified}
                loading={verifyLoading}
                className="w-full"
              >
                I have verified my email
              </Button>
            </div>
          </Card>

          <p className="text-sm text-ink-secondary text-center mt-6">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setShowVerification(false)}
              className="text-accent hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-xl font-semibold text-ink"
          >
            InterviewPreview
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mt-6 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-ink-secondary">
            {hasSetupData
              ? "Sign up to start your interview"
              : "Save your scorecards and track your progress over time"}
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-btn p-3">
                {error}
              </div>
            )}
            <div>
              <label className="label-tag block mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-tag block mb-2">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-sm text-ink-secondary text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
