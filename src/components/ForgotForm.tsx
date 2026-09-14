"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Field, fieldClass } from "./Field";
import { Icon } from "./Icon";
import { forgotPassword, resetPassword } from "@/lib/auth";
import { OTPForm } from "./OTPForm";

type Step = "email" | "sent" | "reset";

export function ForgotForm() {
  const t = useTranslations("forgot");
  const tAuth = useTranslations("auth");
  const [step, setStep] = useState<Step>("email");
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");

    const fd = new FormData(event.currentTarget);
    const emailVal = (fd.get("email") as string).trim().toLowerCase();

    try {
      await forgotPassword(emailVal);
      setEmail(emailVal);
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus("idle");
    }
  }

  if (step === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-7">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-700 text-white">
          <Icon name="mail" className="h-6 w-6" />
        </span>
        <h2 className="text-xl font-bold text-heading">{t("sentTitle")}</h2>
        <p className="text-sm leading-relaxed text-ink-muted">{t("sentBody")}</p>
        <p className="text-xs leading-relaxed text-ink-faint">
          {t("privacyNote")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={tAuth("emailLabel")} htmlFor="forgot-email" required>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </Field>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "working"}
        className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-coral px-6 py-4 text-base font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "working" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
