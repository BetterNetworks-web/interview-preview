"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const pendingSave = sessionStorage.getItem("pendingSave");
      router.push(pendingSave ? "/scorecard" : "/dashboard");
    }
  };

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
            Welcome back
          </h1>
          <p className="text-sm text-ink-secondary">
            Log in to view your score history and progress
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Log In
            </Button>
          </form>
        </Card>

        <p className="text-sm text-ink-secondary text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
