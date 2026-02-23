"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "font-body font-medium rounded-btn transition-all duration-200 tracking-wide inline-flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-ink text-parchment hover:bg-opacity-90",
    secondary:
      "bg-transparent text-ink border border-ink hover:bg-ink hover:text-parchment",
    accent: "bg-accent text-parchment hover:bg-opacity-90",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
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
      {children}
    </button>
  );
}
