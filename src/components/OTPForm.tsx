"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { verifyOTP, resendOTP } from "@/lib/auth";

type Props = {
  otpId: number;
  email: string;
  purpose: "login" | "signup" | "reset";
  onVerified: (token: string) => void;
  onBack: () => void;
};

const DIGIT_COUNT = 6;

export function OTPForm({ otpId: initialOtpId, email, purpose, onVerified, onBack }: Props) {
  const t = useTranslations("otp");
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const [status, setStatus] = useState<"idle" | "verifying" | "error" | "resending">("idle");
  const [error, setError] = useState("");
  const [currentOtpId, setCurrentOtpId] = useState(initialOtpId);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError("");

    if (value && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d) && next.join("").length === DIGIT_COUNT) {
      submitOTP(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGIT_COUNT);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    const focusIdx = Math.min(pasted.length, DIGIT_COUNT - 1);
    inputRefs.current[focusIdx]?.focus();

    if (next.every((d) => d)) {
      submitOTP(next.join(""));
    }
  }

  async function submitOTP(code: string) {
    setStatus("verifying");
    setError("");
    try {
      const res = await verifyOTP(currentOtpId, code, email);
      onVerified(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
      setStatus("error");
      setDigits(Array(DIGIT_COUNT).fill(""));
      inputRefs.current[0]?.focus();
    }
  }

  async function handleResend() {
    setStatus("resending");
    setError("");
    try {
      const res = await resendOTP(email, purpose);
      setCurrentOtpId(res.otpId);
      setResendCooldown(60);
      setDigits(Array(DIGIT_COUNT).fill(""));
      inputRefs.current[0]?.focus();
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-heading">{t("title")}</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {t("sentTo")} <span dir="ltr" className="font-semibold text-heading">{email}</span>
        </p>
      </div>

      <div className="flex gap-2.5" dir="ltr" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold transition-colors focus:outline-none ${
              error
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-line bg-surface text-heading focus:border-teal"
            }`}
            aria-label={`${t("digit")} ${i + 1}`}
            disabled={status === "verifying"}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {status === "verifying" && (
        <p className="text-sm text-ink-muted">{t("verifying")}</p>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || status === "resending"}
          className="text-sm font-semibold text-teal-ink transition-colors hover:text-heading disabled:text-ink-faint"
        >
          {resendCooldown > 0
            ? `${t("resendIn")} ${resendCooldown}s`
            : status === "resending"
              ? t("resending")
              : t("resend")}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-muted transition-colors hover:text-heading"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}
