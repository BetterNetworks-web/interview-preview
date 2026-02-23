"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="label-tag block mb-2">{label}</label>}
      <input className={`input-field ${className}`} {...props} />
    </div>
  );
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="label-tag block mb-2">{label}</label>}
      <textarea className={`textarea-field ${className}`} rows={6} {...props} />
    </div>
  );
}
