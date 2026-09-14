"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Field, PasswordField, fieldClass } from "./Field";
import { NotConnectedNotice } from "./AuthNotice";

export function SignupForm() {
  const t = useTranslations("signup");
  const tAuth = useTranslations("auth");
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: hand off to the auth provider's registration call.
    window.setTimeout(() => setStatus("blocked"), 600);
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

      {/* 12 characters, matching the hint. Length beats composition rules —
          NIST dropped forced symbol/number mixes years ago. */}
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

      {status === "blocked" && (
        <NotConnectedNotice
          title={tAuth("notConnectedTitle")}
          body={tAuth("notConnectedBody")}
        />
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
