"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Field, PasswordField, fieldClass } from "./Field";
import { OTPForm } from "./OTPForm";
import { login, getStoredUser } from "@/lib/auth";

type Step = "credentials" | "otp";

export function LoginForm() {
  const t = useTranslations("login");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState("");
  const [otpId, setOtpId] = useState(0);
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");

    const fd = new FormData(event.currentTarget);
    const emailVal = (fd.get("email") as string).trim().toLowerCase();
    const password = fd.get("password") as string;

    try {
      const res = await login(emailVal, password);
      setOtpId(res.otpId);
      setEmail(res.email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : tAuth("notConnectedBody"));
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
        purpose="login"
        onVerified={handleVerified}
        onBack={() => setStep("credentials")}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={tAuth("emailLabel")} htmlFor="login-email" required>
        <input
          id="login-email"
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
        autoComplete="current-password"
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="inline-block py-1 text-sm font-semibold text-teal-ink transition-colors hover:text-heading"
        >
          {t("forgot")}
        </Link>
      </div>

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
