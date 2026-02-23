"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
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
          {showAuth && (
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
        </nav>
      </div>
    </header>
  );
}
