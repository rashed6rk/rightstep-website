"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { PortalClient } from "@/lib/portal";
import type { ServiceKey } from "@/lib/site";
import { Field, PasswordField, fieldClass } from "../Field";
import { NotConnectedNotice } from "../AuthNotice";
import { Icon } from "../Icon";

/**
 * Two independent forms, not one.
 *
 * Personal and company details change often and should save in one click;
 * a password change is rare and deliberate. An earlier version put both under
 * one submit with the password fields marked `required` — which meant editing
 * your name silently failed until you also typed your current password twice,
 * because the browser's own validation blocks a submit with an empty required
 * field. Splitting them means neither section can block the other, and
 * "reduce clicks" actually holds for the common case (details) instead of
 * being undercut by the rare one (password).
 */
export function ProfileForm({
  client,
  industries,
}: {
  client: PortalClient;
  industries: { key: ServiceKey; title: string }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <DetailsForm client={client} industries={industries} />
      <PasswordForm />
    </div>
  );
}

function DetailsForm({
  client,
  industries,
}: {
  client: PortalClient;
  industries: { key: ServiceKey; title: string }[];
}) {
  const t = useTranslations("portal.profile");
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: PATCH the account record, then re-verify the email if it changed.
    window.setTimeout(() => setStatus("blocked"), 600);
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
              defaultValue={client.name}
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
              defaultValue={client.email}
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
              defaultValue={client.phone}
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
                defaultValue={client.industry}
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
              defaultValue={client.goals}
              className={`${fieldClass} resize-y`}
            />
          </Field>
        </div>
      </fieldset>

      {status === "blocked" && (
        <NotConnectedNotice
          title={t("notConnectedTitle")}
          body={t("notConnectedBody")}
        />
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
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: verify currentPassword server-side before accepting newPassword.
    window.setTimeout(() => setStatus("blocked"), 600);
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

        {status === "blocked" && (
          <div className="mt-5">
            <NotConnectedNotice
              title={t("notConnectedTitle")}
              body={t("notConnectedBody")}
            />
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
