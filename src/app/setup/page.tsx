"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";

const DIFFICULTIES = [
  {
    id: "comfortable",
    label: "Comfortable",
    description:
      "Supportive tone, lighter follow-up pressure. Good for building confidence.",
  },
  {
    id: "realistic",
    label: "Realistic",
    description:
      "Standard interview pace and pressure. What most real interviews feel like.",
  },
  {
    id: "hard",
    label: "Hard",
    description:
      "Follow-up questions and pushback on vague answers. Expect to be challenged.",
  },
  {
    id: "brutal",
    label: "Brutal",
    description:
      "Aggressive follow-ups, no concessions, catches deflections. The toughest prep available.",
  },
];

const STEPS = [
  {
    question: "What role are you interviewing for?",
    placeholder: "e.g. Senior Product Manager, Software Engineer, Data Analyst",
    type: "input" as const,
    field: "role",
  },
  {
    question:
      "Paste the job description or describe the key requirements",
    placeholder:
      "Paste the full job description here, or describe the main responsibilities and requirements...",
    type: "textarea" as const,
    field: "jobDescription",
  },
  {
    question: "Paste your CV or summarise your experience",
    placeholder:
      "Paste your CV text here, or write a summary of your relevant experience, skills, and accomplishments...",
    type: "textarea" as const,
    field: "cvSummary",
  },
  {
    question:
      "What is your biggest weak area going into this interview?",
    placeholder:
      "e.g. I struggle with behavioural questions, I lack experience in X, I tend to ramble...",
    type: "input" as const,
    field: "weakArea",
  },
  {
    question: "Choose your difficulty",
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
    difficulty: "",
  });

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const canContinue =
    formData[currentStep.field as keyof typeof formData].trim() !== "";

  const handleContinue = () => {
    if (isLastStep) {
      sessionStorage.setItem("interviewSetup", JSON.stringify(formData));
      router.push("/interview");
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
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8 leading-tight">
            {currentStep.question}
          </h1>

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

          {currentStep.type === "difficulty" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() =>
                    setFormData({ ...formData, difficulty: d.id })
                  }
                  className={`text-left p-5 rounded-card border transition-all duration-200 ${
                    formData.difficulty === d.id
                      ? "border-accent bg-accent/5 shadow-warm"
                      : "border-border bg-paper hover:border-ink-secondary/30"
                  }`}
                >
                  <p className="font-body font-medium text-ink mb-1">
                    {d.label}
                  </p>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {d.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Continue */}
          <div className="mt-10">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue}
              className="min-w-[200px]"
            >
              {isLastStep ? "Start Interview" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
