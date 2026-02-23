"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface SetupData {
  role: string;
  jobDescription: string;
  cvSummary: string;
  weakArea: string;
  difficulty: string;
}

export default function InterviewPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [answeringFollowUp, setAnsweringFollowUp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  // Load setup data and generate questions
  useEffect(() => {
    const stored = sessionStorage.getItem("interviewSetup");
    if (!stored) {
      router.push("/setup");
      return;
    }

    const data: SetupData = JSON.parse(stored);
    setSetup(data);

    fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_questions", ...data }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
        } else {
          setError("Failed to generate questions. Please try again.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to generate questions. Please try again.");
        setLoading(false);
      });
  }, [router]);

  // Timer
  useEffect(() => {
    if (loading || !questions.length) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [loading, questions.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = useCallback(async () => {
    if (!currentAnswer.trim() || !setup) return;

    setSubmitting(true);

    if (answeringFollowUp) {
      // Follow-up answer: append to the previous answer
      const updatedAnswers = [...answers];
      updatedAnswers[updatedAnswers.length - 1] += `\n\n[Follow-up: ${followUp}]\n${currentAnswer}`;
      setAnswers(updatedAnswers);
      setFollowUp(null);
      setAnsweringFollowUp(false);
      setCurrentAnswer("");

      // Move to next question
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Interview complete
        sessionStorage.setItem(
          "interviewData",
          JSON.stringify({
            ...setup,
            questions,
            answers: updatedAnswers,
          })
        );
        router.push("/scorecard");
      }
      setSubmitting(false);
      return;
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    // Check for follow-up on hard/brutal
    if (setup.difficulty === "hard" || setup.difficulty === "brutal") {
      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "follow_up",
            question: questions[currentIndex],
            answer: currentAnswer,
            difficulty: setup.difficulty,
          }),
        });
        const data = await res.json();
        if (data.follow_up && data.follow_up !== "null") {
          setFollowUp(data.follow_up);
          setAnsweringFollowUp(true);
          setCurrentAnswer("");
          setSubmitting(false);
          return;
        }
      } catch {
        // Continue without follow-up on error
      }
    }

    setCurrentAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Interview complete
      sessionStorage.setItem(
        "interviewData",
        JSON.stringify({
          ...setup,
          questions,
          answers: newAnswers,
        })
      );
      router.push("/scorecard");
    }

    setSubmitting(false);
  }, [currentAnswer, setup, answeringFollowUp, followUp, answers, currentIndex, questions, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-display text-xl text-ink mb-2">
            Preparing your interview
          </p>
          <p className="text-sm text-ink-secondary">
            Generating questions tailored to your role...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="font-display text-xl text-ink mb-4">{error}</p>
          <Button onClick={() => router.push("/setup")}>Back to Setup</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = answeringFollowUp
    ? followUp!
    : questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-border bg-parchment/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-14">
          <span className="label-tag">{setup?.role}</span>
          <div className="flex items-center gap-6">
            <span className="label-tag">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-mono text-xs text-ink-secondary">
              {formatTime(timer)}
            </span>
          </div>
        </div>
        {/* Progress line */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{
              width: `${((currentIndex + (answeringFollowUp ? 0.5 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full animate-fade-in" key={`${currentIndex}-${answeringFollowUp}`}>
          {answeringFollowUp && (
            <p className="label-tag text-accent mb-4">Follow-up Question</p>
          )}
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-relaxed mb-8">
            &ldquo;{currentQuestion}&rdquo;
          </h2>

          <textarea
            className="textarea-field text-base min-h-[200px]"
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            autoFocus
          />

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-ink-secondary/60">
              Take your time. Answer as you would in a real interview.
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!currentAnswer.trim()}
              loading={submitting}
            >
              {currentIndex === questions.length - 1 && !answeringFollowUp
                ? "Finish Interview"
                : "Submit Answer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
