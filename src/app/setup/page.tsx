"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase";
import * as gtag from "@/lib/gtag";

const INTERVIEW_TYPES = [
  {
    id: "general",
    label: "General",
    icon: "G",
    description:
      "A balanced mix of behavioural, situational, and role-specific questions.",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: "B",
    description:
      "Focus on past experiences using the STAR method. 'Tell me about a time...' style questions.",
  },
  {
    id: "technical",
    label: "Technical",
    icon: "T",
    description:
      "Deep-dive into role-specific technical knowledge and problem-solving.",
  },
  {
    id: "situational",
    label: "Situational",
    icon: "S",
    description:
      "Hypothetical scenarios testing your judgment and decision-making.",
  },
  {
    id: "case_study",
    label: "Case Study",
    icon: "C",
    description:
      "Problem-solving exercises where you walk through a business challenge.",
  },
];

const DIFFICULTIES = [
  {
    id: "comfortable",
    label: "Comfortable",
    icon: "~",
    description:
      "Supportive tone, lighter follow-up pressure. Good for building confidence.",
  },
  {
    id: "realistic",
    label: "Realistic",
    icon: "=",
    description:
      "Standard interview pace and pressure. What most real interviews feel like.",
  },
  {
    id: "hard",
    label: "Hard",
    icon: "!",
    description:
      "Follow-up questions and pushback on vague answers. Expect to be challenged.",
  },
  {
    id: "brutal",
    label: "Brutal",
    icon: "!!",
    description:
      "Aggressive follow-ups, no concessions, catches deflections. The toughest prep available.",
  },
];

const STEPS = [
  {
    question: "What role are you interviewing for?",
    subtitle: "We'll tailor every question to this position.",
    placeholder: "e.g. Senior Product Manager, Software Engineer, Data Analyst",
    type: "input" as const,
    field: "role",
  },
  {
    question: "Paste the job description",
    subtitle:
      "The more detail you give, the sharper the questions. Include key requirements and responsibilities.",
    placeholder:
      "Paste the full job description here, or describe the main responsibilities and requirements...",
    type: "textarea" as const,
    field: "jobDescription",
  },
  {
    question: "Now, paste your CV or summarise your experience",
    subtitle:
      "This lets us probe your actual background — not generic questions.",
    placeholder:
      "Paste your CV text here, or write a summary of your relevant experience, skills, and accomplishments...",
    type: "textarea" as const,
    field: "cvSummary",
  },
  {
    question: "What's your biggest weak spot?",
    subtitle:
      "We'll push harder here so you're ready when it matters.",
    placeholder:
      "e.g. I struggle with behavioural questions, I lack experience in X, I tend to ramble...",
    type: "input" as const,
    field: "weakArea",
  },
  {
    question: "What type of interview?",
    subtitle:
      "General covers everything. Pick a focus if you want to target a specific style.",
    type: "interviewType" as const,
    field: "interviewType",
  },
  {
    question: "How tough do you want it?",
    subtitle: "You can always change this next time.",
    type: "difficulty" as const,
    field: "difficulty",
  },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    role: "",
    jobDescription: "",
    cvSummary: "",
    weakArea: "",
    interviewType: "general",
    difficulty: "",
  });

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const canContinue =
    formData[currentStep.field as keyof typeof formData].trim() !== "";

  const handleContinue = async () => {
    if (isLastStep) {
      sessionStorage.setItem("interviewSetup", JSON.stringify(formData));
      gtag.event("interview_setup_complete", {
        role: formData.role,
        interview_type: formData.interviewType,
        difficulty: formData.difficulty,
      });
      const { data: { session } } = await supabase.auth.getSession();
      router.push(session ? "/interview" : "/signup");
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && currentStep.type === "input" && canContinue) {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="section-container pt-8">
        <ProgressBar current={step + 1} total={STEPS.length} />
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full animate-fade-in" key={step}>
          {/* Back button */}
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors mb-8"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M10 12L6 8L10 4" />
              </svg>
              Back
            </button>
          )}

          {/* Question */}
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3 leading-tight">
            {currentStep.question}
          </h1>

          {/* Subtitle */}
          {"subtitle" in currentStep && currentStep.subtitle && (
            <p className="text-ink-secondary text-base mb-8 leading-relaxed">
              {currentStep.subtitle}
            </p>
          )}

          {/* Input */}
          {currentStep.type === "input" && (
            <input
              type="text"
              className="input-field text-lg py-4"
              placeholder={currentStep.placeholder}
              value={formData[currentStep.field as keyof typeof formData]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [currentStep.field]: e.target.value,
                })
              }
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}

          {currentStep.type === "textarea" && (
            <textarea
              className="textarea-field text-base"
              rows={8}
              placeholder={currentStep.placeholder}
              value={formData[currentStep.field as keyof typeof formData]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [currentStep.field]: e.target.value,
                })
              }
              autoFocus
            />
          )}

          {currentStep.type === "interviewType" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTERVIEW_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setFormData({ ...formData, interviewType: t.id })
                  }
                  className={`text-left p-5 rounded-card border-2 transition-all duration-200 group ${
                    formData.interviewType === t.id
                      ? "border-accent bg-accent/5 shadow-warm-lg"
                      : "border-border bg-paper hover:border-ink-secondary/30 hover:shadow-warm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        formData.interviewType === t.id
                          ? "bg-accent text-parchment"
                          : "bg-border text-ink-secondary group-hover:bg-ink-secondary/20"
                      }`}
                    >
                      {t.icon}
                    </span>
                    <p className="font-body font-medium text-ink">
                      {t.label}
                    </p>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed pl-10">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {currentStep.type === "difficulty" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() =>
                    setFormData({ ...formData, difficulty: d.id })
                  }
                  className={`text-left p-5 rounded-card border-2 transition-all duration-200 group ${
                    formData.difficulty === d.id
                      ? "border-accent bg-accent/5 shadow-warm-lg"
                      : "border-border bg-paper hover:border-ink-secondary/30 hover:shadow-warm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        formData.difficulty === d.id
                          ? "bg-accent text-parchment"
                          : "bg-border text-ink-secondary group-hover:bg-ink-secondary/20"
                      }`}
                    >
                      {d.icon}
                    </span>
                    <p className="font-body font-medium text-ink">
                      {d.label}
                    </p>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed pl-10">
                    {d.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Continue */}
          <div className="mt-10 flex items-center gap-4">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue}
              className="min-w-[200px]"
            >
              {isLastStep ? "Start Interview" : "Continue"}
            </Button>
            {currentStep.type === "input" && canContinue && (
              <span className="text-xs text-ink-secondary/60 font-mono hidden sm:inline">
                press Enter
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
