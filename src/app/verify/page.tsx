"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function VerifyPage() {
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
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-600"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-3">
              Email verified
            </h1>
            <p className="text-sm text-ink-secondary mb-6">
              You can close this tab and return to your practice exam. Click{" "}
              <span className="font-medium text-ink">
                &ldquo;I have verified my email&rdquo;
              </span>{" "}
              on the signup page to continue.
            </p>
            <div className="border-t border-parchment pt-4">
              <p className="text-sm text-ink-secondary mb-3">
                Or sign in here instead:
              </p>
              <Link href="/login">
                <Button variant="secondary" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
