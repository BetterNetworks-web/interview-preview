"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAuth) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setUserEmail(user?.email ?? null);

      if (user) {
        supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single()
          .then(({ data: sub }) => {
            setIsPro(sub?.plan === "pro");
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email ?? null);

      if (session?.user) {
        supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .single()
          .then(({ data: sub }) => {
            setIsPro(sub?.plan === "pro");
          });
      } else {
        setIsPro(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [showAuth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    closeMobileMenu();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleManagePlan = async () => {
    if (!isPro) {
      setDropdownOpen(false);
      router.push("/pricing");
      return;
    }

    setPortalLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const truncatedEmail =
    userEmail && userEmail.length > 20
      ? userEmail.slice(0, 20) + "..."
      : userEmail;

  return (
    <header className="w-full border-b border-border bg-parchment/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="section-container flex items-center justify-between h-16">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          InterviewPreview
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
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
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="font-body text-sm text-ink-secondary hover:text-ink transition-colors"
                  >
                    Dashboard
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 font-body text-sm text-ink hover:text-ink/80 transition-colors px-3 py-1.5 rounded-btn border border-border hover:border-ink/20"
                    >
                      {isPro && (
                        <span className="bg-accent text-parchment text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                          PRO
                        </span>
                      )}
                      <span className="max-w-[120px] truncate">
                        {truncatedEmail}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-paper border border-border rounded-card shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-body text-xs text-ink-secondary truncate">
                            {userEmail}
                          </p>
                          {isPro && (
                            <p className="font-body text-xs text-accent font-semibold mt-0.5">
                              Pro Member
                            </p>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleManagePlan}
                            disabled={portalLoading}
                            className="w-full text-left px-4 py-2.5 font-body text-sm text-ink hover:bg-parchment transition-colors flex items-center justify-between"
                          >
                            <span>
                              {isPro ? "Manage Plan" : "Upgrade to Pro"}
                            </span>
                            {portalLoading && (
                              <svg
                                className="animate-spin h-3.5 w-3.5 text-ink-secondary"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 font-body text-sm text-ink hover:bg-parchment transition-colors"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 text-ink"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-[9999] md:hidden">
          <div
            className="absolute inset-0 bg-ink/20"
            onClick={closeMobileMenu}
          />
          <nav className="relative bg-paper border-b border-border shadow-lg">
            <div className="flex flex-col py-4 px-6 gap-1">
              <Link
                href="/pricing"
                onClick={closeMobileMenu}
                className="font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3 border-b border-border/50"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3 border-b border-border/50"
              >
                Blog
              </Link>
              {showAuth && (
                <>
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3 border-b border-border/50"
                      >
                        Dashboard
                      </Link>
                      <div className="py-3 border-b border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          {isPro && (
                            <span className="bg-accent text-parchment text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                              PRO
                            </span>
                          )}
                          <span className="font-body text-xs text-ink-secondary truncate">
                            {userEmail}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          handleManagePlan();
                        }}
                        disabled={portalLoading}
                        className="text-left font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3 border-b border-border/50"
                      >
                        {isPro ? "Manage Plan" : "Upgrade to Pro"}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-left font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="font-body text-sm text-ink-secondary hover:text-ink transition-colors py-3 border-b border-border/50"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/setup"
                        onClick={closeMobileMenu}
                        className="py-3"
                      >
                        <Button size="sm" className="w-full">
                          Start Your First Interview
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
