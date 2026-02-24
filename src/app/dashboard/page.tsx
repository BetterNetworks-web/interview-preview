"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScoreBar from "@/components/ui/ScoreBar";
import Header from "@/components/layout/Header";
import { formatDate } from "@/lib/utils";

interface Dimension {
  score: number;
  feedback: string;
}

interface ScorecardRecord {
  id: string;
  overall_score: number;
  verdict: string;
  created_at: string;
  dimensions: {
    evidence_specificity: Dimension;
    handling_pressure: Dimension;
    self_awareness: Dimension;
    strategic_thinking: Dimension;
  } | null;
  one_thing_to_fix: string | null;
  interviews: {
    role: string;
    difficulty: string;
  };
}

const DIMENSION_LABELS: Record<string, string> = {
  evidence_specificity: "Evidence & Specificity",
  handling_pressure: "Handling Pressure",
  self_awareness: "Self-Awareness",
  strategic_thinking: "Strategic Thinking",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [scorecards, setScorecards] = useState<ScorecardRecord[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser({ email: user.email });

      // Check subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      const userIsPro = sub?.plan === "pro";
      setIsPro(userIsPro);

      // Load scorecards
      const query = supabase
        .from("scorecards")
        .select(
          `
          id,
          overall_score,
          verdict,
          dimensions,
          one_thing_to_fix,
          created_at,
          interviews (role, difficulty)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!userIsPro) {
        query.limit(3);
      }

      const { data: cards } = await query;
      setScorecards((cards as unknown as ScorecardRecord[]) || []);

      // Calculate streak
      if (userIsPro && cards && cards.length > 0) {
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dates = cards.map((c: { created_at: string }) => {
          const d = new Date(c.created_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        });

        const uniqueDates = Array.from(new Set(dates)).sort(
          (a: number, b: number) => b - a
        );

        for (let i = 0; i < uniqueDates.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          expected.setHours(0, 0, 0, 0);

          if (uniqueDates[i] === expected.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header showAuth={false} />
      <div className="section-container py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-ink-secondary">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/setup">
              <Button size="sm">New Interview</Button>
            </Link>
            <Button size="sm" variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card padding="md">
            <p className="label-tag mb-2">Total Interviews</p>
            <p className="font-display text-3xl font-semibold text-ink">
              {scorecards.length}
            </p>
          </Card>
          <Card padding="md">
            <p className="label-tag mb-2">Best Score</p>
            <p className="font-display text-3xl font-semibold text-accent">
              {scorecards.length > 0
                ? Math.max(...scorecards.map((s) => s.overall_score))
                : "—"}
            </p>
          </Card>
          <Card padding="md">
            <p className="label-tag mb-2">
              {isPro ? "Current Streak" : "Streak (Pro)"}
            </p>
            <p className="font-display text-3xl font-semibold text-ink">
              {isPro ? (
                <>
                  {streak}{" "}
                  <span className="text-lg text-ink-secondary">
                    {streak === 1 ? "day" : "days"}
                  </span>
                </>
              ) : (
                <Link
                  href="/pricing"
                  className="text-accent text-lg hover:underline"
                >
                  Upgrade
                </Link>
              )}
            </p>
          </Card>
        </div>

        {/* Score History Chart */}
        {scorecards.length > 1 && (
          <Card padding="lg" className="mb-12">
            <h3 className="font-display text-lg font-semibold mb-6">
              Score Over Time
            </h3>
            <div className="h-48 flex items-end gap-2">
              {[...scorecards].reverse().map((s, i) => (
                <div
                  key={s.id}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="font-mono text-xs text-ink-secondary">
                    {s.overall_score}
                  </span>
                  <div
                    className="w-full bg-accent/20 rounded-t-sm relative"
                    style={{ height: `${(s.overall_score / 100) * 160}px` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-accent rounded-t-sm animate-fill-bar"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-ink-secondary">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Analytics Section — shown with 2+ interviews */}
        {scorecards.length >= 2 && (() => {
          const cardsWithDimensions = scorecards.filter((s) => s.dimensions);
          if (cardsWithDimensions.length < 2) return null;

          const dimKeys = ["evidence_specificity", "handling_pressure", "self_awareness", "strategic_thinking"] as const;
          const dimAverages = dimKeys.map((key) => {
            const scores = cardsWithDimensions.map((s) => s.dimensions![key].score);
            const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            return { key, label: DIMENSION_LABELS[key], avg };
          });

          const sorted = [...dimAverages].sort((a, b) => b.avg - a.avg);
          const strongest = sorted[0];
          const weakest = sorted[sorted.length - 1];

          const recentFixes = scorecards
            .filter((s) => s.one_thing_to_fix)
            .slice(0, 5)
            .map((s) => s.one_thing_to_fix!);

          return (
            <div className="mb-12 space-y-8">
              <h3 className="font-display text-lg font-semibold">
                Performance Analytics
              </h3>

              {/* Dimension Averages */}
              <Card padding="lg">
                <h4 className="font-display text-base font-semibold mb-6">
                  Dimension Averages
                </h4>
                {dimAverages.map((d) => (
                  <ScoreBar key={d.key} label={d.label} score={d.avg} />
                ))}
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card padding="md">
                  <p className="label-tag mb-2">Strongest Area</p>
                  <p className="font-display text-xl font-semibold text-ink mb-1">
                    {strongest.label}
                  </p>
                  <p className="font-mono text-sm text-accent">
                    {strongest.avg}/100 avg
                  </p>
                </Card>
                <Card padding="md">
                  <p className="label-tag mb-2">Area to Improve</p>
                  <p className="font-display text-xl font-semibold text-ink mb-1">
                    {weakest.label}
                  </p>
                  <p className="font-mono text-sm text-ink-secondary">
                    {weakest.avg}/100 avg
                  </p>
                </Card>
              </div>

              {/* Common Themes to Fix */}
              {recentFixes.length > 0 && (
                <Card padding="lg">
                  <h4 className="font-display text-base font-semibold mb-4">
                    Common Themes to Fix
                  </h4>
                  <ul className="space-y-3">
                    {recentFixes.map((fix, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink-secondary leading-relaxed">
                        <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          );
        })()}

        {/* Past Scorecards */}
        <h3 className="font-display text-lg font-semibold mb-4">
          Past Interviews
        </h3>
        {scorecards.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-ink-secondary mb-4">
              No interviews yet. Start your first one!
            </p>
            <Link href="/setup">
              <Button size="sm">Start Interview</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {scorecards.map((s) => (
              <Card key={s.id} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body font-medium text-ink">
                      {s.interviews?.role || "Interview"}
                    </p>
                    <p className="text-xs text-ink-secondary mt-1">
                      {formatDate(s.created_at)}
                      {s.interviews?.difficulty && (
                        <>
                          {" "}
                          &middot;{" "}
                          <span className="capitalize">
                            {s.interviews.difficulty}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg text-accent font-medium">
                      {s.overall_score}
                    </span>
                    <span className="font-mono text-xs text-ink-secondary">
                      /100
                    </span>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary mt-2">{s.verdict}</p>
              </Card>
            ))}
          </div>
        )}

        {!isPro && scorecards.length >= 3 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-ink-secondary mb-3">
              Free accounts show the last 3 interviews.{" "}
              <Link href="/pricing" className="text-accent hover:underline">
                Upgrade to Pro
              </Link>{" "}
              to see your full history.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
