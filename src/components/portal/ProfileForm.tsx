"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { ServiceKey } from "@/lib/site";
import { Field, PasswordField, fieldClass } from "../Field";
import { Icon } from "../Icon";
import { useAuth } from "@/lib/auth-context";
import { updateProfile, changePassword } from "@/lib/auth";

export function ProfileForm({
  industries,
}: {
  industries: { key: ServiceKey; title: string }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <DetailsForm industries={industries} />
      <PasswordForm />
    </div>
  );
}

function DetailsForm({
  industries,
}: {
  industries: { key: ServiceKey; title: string }[];
}) {
  const t = useTranslations("portal.profile");
  const { user, refresh } = useAuth();
  const [status, setStatus] = useState<"idle" | "working" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      await updateProfile({
        name: (form.get("name") as string).trim(),
        email: (form.get("email") as string).trim(),
        phone: (form.get("phone") as string).trim(),
      });
      await refresh();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("genericError"));
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <fieldset className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <legend className="px-1 text-base font-bold text-heading">
          {t("personalTitle")}
        </legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label={t("fullName")} htmlFor="pf-name" required>
            <input
              id="pf-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={user?.name ?? ""}
              className={fieldClass}
            />
          </Field>
          <Field label={t("email")} htmlFor="pf-email" required>
            <input
              id="pf-email"
              name="email"
              type="email"
              required
              dir="ltr"
              autoComplete="email"
              defaultValue={user?.email ?? ""}
              className={fieldClass}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label={t("phone")} htmlFor="pf-phone" required>
            <input
              id="pf-phone"
              name="phone"
              type="tel"
              required
              dir="ltr"
              autoComplete="tel"
              placeholder="+971 50 000 0000"
              defaultValue={user?.phone ?? ""}
              className={`${fieldClass} sm:max-w-xs`}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <legend className="px-1 text-base font-bold text-heading">
          {t("companyTitle")}
        </legend>
        <div className="mt-4 flex flex-col gap-5">
          <Field label={t("industry")} htmlFor="pf-industry" required>
            <div className="relative">
              <select
                id="pf-industry"
                name="industry"
                required
                defaultValue="communication"
                className={`${fieldClass} appearance-none pe-11 sm:max-w-xs`}
              >
                {industries.map((industry) => (
                  <option key={industry.key} value={industry.key}>
                    {industry.title}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-ink-faint"
              />
            </div>
          </Field>
          <Field label={t("goals")} htmlFor="pf-goals">
            <textarea
              id="pf-goals"
              name="goals"
              rows={3}
              placeholder={t("goalsPlaceholder")}
              className={`${fieldClass} resize-y`}
            />
          </Field>
        </div>
      </fieldset>

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3.5 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <Icon name="secure" className="mt-0.5 h-5 w-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className="flex items-start gap-3.5 rounded-xl border border-teal-200 bg-teal-50 p-4"
        >
          <Icon name="check" className="mt-0.5 h-5 w-5 text-teal-700" />
          <p className="text-sm font-semibold text-teal-800">{t("saved")}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "working"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-coral px-6 py-3.5 text-sm font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
      >
        {status === "working" ? t("saving") : t("saveCta")}
      </button>
    </form>
  );
}

function PasswordForm() {
  const t = useTranslations("portal.profile");
  const [status, setStatus] = useState<"idle" | "working" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    setError("");

    const form = new FormData(event.currentTarget);
    const currentPw = (form.get("currentPassword") as string).trim();
    const newPw = (form.get("newPassword") as string).trim();

    if (newPw.length < 12) {
      setError(t("passwordTooShort"));
      setStatus("error");
      return;
    }

    try {
      await changePassword(currentPw, newPw);
      setStatus("success");
      event.currentTarget.reset();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("genericError"));
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <legend className="px-1 text-base font-bold text-heading">
          {t("accountTitle")}
        </legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <PasswordField
            label={t("currentPassword")}
            name="currentPassword"
            autoComplete="current-password"
          />
          <PasswordField
            label={t("newPassword")}
            name="newPassword"
            autoComplete="new-password"
            minLength={12}
          />
        </div>

        {status === "error" && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3.5 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <Icon name="secure" className="mt-0.5 h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {status === "success" && (
          <div
            role="status"
            className="mt-5 flex items-start gap-3.5 rounded-xl border border-teal-200 bg-teal-50 p-4"
          >
            <Icon name="check" className="mt-0.5 h-5 w-5 text-teal-700" />
            <p className="text-sm font-semibold text-teal-800">{t("passwordChanged")}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "working"}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-navy/20 px-6 py-3.5 text-sm font-bold text-heading transition-colors hover:border-navy/50 hover:bg-navy/[0.04] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
        >
          {status === "working" ? t("saving") : t("saveCta")}
        </button>
      </fieldset>
    </form>
  );
}
