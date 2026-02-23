interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="label-tag">
          Step {current} of {total}
        </span>
        <span className="label-tag">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
