"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Field, PasswordField, fieldClass } from "./Field";
import { NotConnectedNotice } from "./AuthNotice";

export function LoginForm() {
  const t = useTranslations("login");
  const tAuth = useTranslations("auth");
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: hand off to the auth provider's sign-in call. Application code
    // must never compare or store the password itself.
    window.setTimeout(() => setStatus("blocked"), 600);
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

      {status === "blocked" && (
        <NotConnectedNotice
          title={tAuth("notConnectedTitle")}
          body={tAuth("notConnectedBody")}
          action={
            <Link
              href="/portal"
              className="inline-flex min-h-8 items-center gap-1.5 text-sm font-bold text-heading underline underline-offset-4 transition-colors hover:text-coral-ink"
            >
              {tAuth("viewDemo")}
            </Link>
          }
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
