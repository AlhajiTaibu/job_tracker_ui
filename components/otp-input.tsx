"use client";

import { useRef, useState } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const otp = Array.from({ length }, (_, i) => value[i] || "");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (InputValue: string, index: number) => {
    if (!/^\d?$/.test(InputValue)) return;

    const next = [...otp];
    next[index] = InputValue;
    onChange(next.join(""));

    if (InputValue && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const next = pasted.split("");
    while (next.length < 6) next.push("");
    onChange(next.join(""));
  };

  return (
    <div className="flex gap-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="h-12 w-12 rounded-lg border bg-background text-center text-lg font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      ))}
    </div>
  );
}
