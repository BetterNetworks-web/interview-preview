export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional";
  if (score >= 75) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 55) return "Average";
  if (score >= 40) return "Below Average";
  return "Needs Work";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-ink";
  return "text-ink-secondary";
}
