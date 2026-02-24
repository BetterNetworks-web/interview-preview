"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScoreBar from "@/components/ui/ScoreBar";

interface Dimension {
  score: number;
  feedback: string;
}

interface QuestionResult {
  question: string;
  answer_summary: string;
  score: number;
  note: string;
}

interface ScorecardData {
  overall_score: number;
  verdict: string;
  dimensions: {
    evidence_specificity: Dimension;
    handling_pressure: Dimension;
    self_awareness: Dimension;
    strategic_thinking: Dimension;
  };
  one_thing_to_fix: string;
  question_breakdown: QuestionResult[];
}

const DIMENSION_LABELS: Record<string, string> = {
  evidence_specificity: "Evidence & Specificity",
  handling_pressure: "Handling Pressure",
  self_awareness: "Self-Awareness",
  strategic_thinking: "Strategic Thinking",
};

export default function ScorecardPage() {
  const router = useRouter();
  const [scorecard, setScorecard] = useState<ScorecardData | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pendingSaveHandled = useRef(false);

  const saveScorecard = useCallback(
    async (scorecardData: ScorecardData) => {
      const stored = sessionStorage.getItem("interviewData");
      if (!stored) return false;

      const interviewData = JSON.parse(stored);
      setSaving(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setSaving(false);
          return false;
        }

        const res = await fetch("/api/scorecard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            interview: {
              role: interviewData.role,
              job_description: interviewData.jobDescription,
              cv_summary: interviewData.cvSummary,
              weak_area: interviewData.weakArea,
              difficulty: interviewData.difficulty,
              questions: interviewData.questions,
              answers: interviewData.answers,
            },
            scorecard: scorecardData,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save");
        }

        sessionStorage.removeItem("interviewData");
        sessionStorage.removeItem("interviewSetup");
        sessionStorage.removeItem("pendingSave");
        return true;
      } catch (err) {
        console.error("Save failed:", err);
        setSaving(false);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("interviewData");
    if (!stored) {
      router.push("/setup");
      return;
    }

    const data = JSON.parse(stored);
    setRole(data.role);

    fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "evaluate", ...data }),
    })
      .then((res) => res.json())
      .then(async (result) => {
        if (result.overall_score !== undefined) {
          setScorecard(result);
          setLoading(false);

          // Handle pending save after returning from login/signup
          const pendingSave = sessionStorage.getItem("pendingSave");
          if (pendingSave && !pendingSaveHandled.current) {
            pendingSaveHandled.current = true;
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              const saved = await saveScorecard(result);
              if (saved) {
                router.push("/dashboard");
              }
            } else {
              sessionStorage.removeItem("pendingSave");
            }
          }
        } else {
          setError("Failed to generate scorecard. Please try again.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to generate scorecard. Please try again.");
        setLoading(false);
      });
  }, [router, saveScorecard]);

  const handleSaveClick = async () => {
    if (!scorecard) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const saved = await saveScorecard(scorecard);
      if (saved) {
        router.push("/dashboard");
      }
    } else {
      sessionStorage.setItem("pendingSave", "true");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-display text-xl text-ink mb-2">
            Evaluating your performance
          </p>
          <p className="text-sm text-ink-secondary">
            Analysing your answers across four dimensions...
          </p>
        </div>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="font-display text-xl text-ink mb-4">
            {error || "Something went wrong"}
          </p>
          <Button onClick={() => router.push("/setup")}>Back to Setup</Button>
        </div>
      </div>
    );
  }

  const getScoreGrade = (score: number) => {
    if (score >= 85) return "Exceptional";
    if (score >= 75) return "Strong";
    if (score >= 65) return "Good";
    if (score >= 55) return "Average";
    if (score >= 40) return "Below Average";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="border-b border-border bg-parchment/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-ink"
          >
            InterviewPreview
          </Link>
          <span className="label-tag">Scorecard</span>
        </div>
      </div>

      <div className="section-container pt-12">
        {/* Overall Score */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="label-tag mb-4">{role}</p>
          <div className="font-display text-8xl md:text-9xl font-bold text-ink mb-2">
            {scorecard.overall_score}
          </div>
          <p className="font-mono text-sm text-accent mb-4">
            {getScoreGrade(scorecard.overall_score)}
          </p>
          <p className="text-lg text-ink-secondary max-w-lg mx-auto">
            {scorecard.verdict}
          </p>
        </div>

        {/* Dimension Scores */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card padding="lg">
            <h3 className="font-display text-xl font-semibold mb-6">
              Performance Breakdown
            </h3>
            {Object.entries(scorecard.dimensions).map(([key, dim]) => (
              <ScoreBar
                key={key}
                label={DIMENSION_LABELS[key] || key}
                score={dim.score}
                feedback={dim.feedback}
              />
            ))}
          </Card>
        </div>

        {/* One Thing to Fix */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-accent/5 border border-accent/20 rounded-card p-8">
            <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
              The One Thing to Fix
            </p>
            <p className="font-display text-xl text-ink leading-relaxed">
              {scorecard.one_thing_to_fix}
            </p>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="font-display text-xl font-semibold mb-6">
            Question-by-Question Breakdown
          </h3>
          <div className="space-y-4">
            {scorecard.question_breakdown.map((qb, i) => (
              <Card key={i} padding="md">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="font-mono text-xs text-accent">Q{i + 1}</p>
                  <span className="font-mono text-sm text-accent font-medium whitespace-nowrap">
                    {qb.score}/100
                  </span>
                </div>
                <p className="font-body font-medium text-sm text-ink mb-2">
                  {qb.question}
                </p>
                <p className="text-sm text-ink-secondary mb-2 italic">
                  {qb.answer_summary}
                </p>
                <p className="text-sm text-ink-secondary">{qb.note}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => {
              sessionStorage.removeItem("interviewData");
              router.push("/interview");
            }}
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              sessionStorage.removeItem("interviewSetup");
              sessionStorage.removeItem("interviewData");
              router.push("/setup");
            }}
          >
            New Role
          </Button>
          <Button
            variant="secondary"
            onClick={handleSaveClick}
            loading={saving}
          >
            Save Scorecard
          </Button>
        </div>
      </div>
    </div>
  );
}
