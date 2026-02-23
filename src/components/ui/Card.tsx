import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`paper-card ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
