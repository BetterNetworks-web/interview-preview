"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/interview");
      }
    });

    // Timeout: if no auth after 10s, show error
    const timeout = setTimeout(() => {
      setError(true);
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="font-display text-xl font-semibold text-ink"
            >
              InterviewPreview
            </Link>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-3">
            Verification failed
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            We couldn&apos;t verify your email. The link may have expired.
          </p>
          <Link
            href="/login"
            className="text-accent hover:underline text-sm font-medium"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-display text-xl text-ink mb-2">
          Verifying your email
        </p>
        <p className="text-sm text-ink-secondary">
          Just a moment...
        </p>
      </div>
    </div>
  );
}
