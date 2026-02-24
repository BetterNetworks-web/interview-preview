"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!showAuth) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [showAuth]);

  return (
    <header className="w-full border-b border-border bg-parchment/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="section-container flex items-center justify-between h-16">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          InterviewPreview
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/pricing"
            className="font-body text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="font-body text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            Blog
          </Link>
          {showAuth && (
            <>
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-body text-sm text-ink-secondary hover:text-ink transition-colors"
                  >
                    Log in
                  </Link>
                  <Link href="/setup">
                    <Button size="sm">Start Your First Interview</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
