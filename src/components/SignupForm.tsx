"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Field, PasswordField, fieldClass } from "./Field";
import { OTPForm } from "./OTPForm";
import { signup, getStoredUser } from "@/lib/auth";

type Step = "form" | "otp";

export function SignupForm() {
  const t = useTranslations("signup");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState("");
  const [otpId, setOtpId] = useState(0);
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");

    const fd = new FormData(event.currentTarget);
    const name = (fd.get("name") as string).trim();
    const emailVal = (fd.get("email") as string).trim().toLowerCase();
    const password = fd.get("password") as string;

    try {
      const res = await signup(name, emailVal, password);
      setOtpId(res.otpId);
      setEmail(res.email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatus("idle");
    }
  }

  function handleVerified() {
    const user = getStoredUser();
    if (user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/portal");
    }
  }

  if (step === "otp") {
    return (
      <OTPForm
        otpId={otpId}
        email={email}
        purpose="signup"
        onVerified={handleVerified}
        onBack={() => setStep("form")}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={t("nameLabel")} htmlFor="signup-name" required>
        <input
          id="signup-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          className={fieldClass}
        />
      </Field>

      <Field label={tAuth("emailLabel")} htmlFor="signup-email" required>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </Field>

      <PasswordField
        label={tAuth("passwordLabel")}
        name="password"
        autoComplete="new-password"
        minLength={12}
        hint={t("passwordHint")}
      />

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-1 h-4.5 w-4.5 shrink-0 rounded border-line accent-[var(--color-coral)]"
        />
        <span>
          {t("termsPrefix")}{" "}
          <span className="font-semibold text-heading underline underline-offset-2">
            {t("terms")}
          </span>{" "}
          {t("and")}{" "}
          <span className="font-semibold text-heading underline underline-offset-2">
            {t("privacy")}
          </span>
          .
        </span>
      </label>

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
