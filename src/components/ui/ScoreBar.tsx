interface ScoreBarProps {
  label: string;
  score: number;
  feedback?: string;
}

export default function ScoreBar({ label, score, feedback }: ScoreBarProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-accent";
    if (s >= 60) return "bg-ink";
    return "bg-ink-secondary";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-body font-medium text-sm text-ink">{label}</span>
        <span className="font-mono text-sm text-accent font-medium">
          {score}/100
        </span>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full animate-fill-bar ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {feedback && (
        <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
          {feedback}
        </p>
      )}
    </div>
  );
}
