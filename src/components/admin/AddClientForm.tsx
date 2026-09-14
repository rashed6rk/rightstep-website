"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Field, fieldClass } from "../Field";
import { NotConnectedNotice } from "../AuthNotice";
import { Icon } from "../Icon";

/**
 * Opens the roster to a new client. Same honesty pattern as every other form
 * on this site: the fields are real, the submit is not — connect a database
 * and this becomes the actual intake flow with zero UI changes.
 */
export function AddClientForm({
  industries,
  onClose,
}: {
  industries: { key: string; title: string }[];
  onClose: () => void;
}) {
  const t = useTranslations("admin.clientsPage");
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: POST to the client-records API, then redirect to the new record.
    window.setTimeout(() => setStatus("blocked"), 600);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="add-client-heading"
      className="rounded-2xl border border-navy/20 bg-surface p-5 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="add-client-heading" className="text-lg font-bold text-heading">
            {t("addClientTitle")}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{t("addClientLead")}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("cancel")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-navy/40 hover:text-heading"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("fullName")} htmlFor="ac-name" required>
            <input
              id="ac-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={fieldClass}
            />
          </Field>
          <Field label={t("company")} htmlFor="ac-company" required>
            <input
              id="ac-company"
              name="company"
              type="text"
              required
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("email")} htmlFor="ac-email" required>
            <input
              id="ac-email"
              name="email"
              type="email"
              required
              dir="ltr"
              autoComplete="email"
              className={fieldClass}
            />
          </Field>
          <Field label={t("phone")} htmlFor="ac-phone" required>
            <input
              id="ac-phone"
              name="phone"
              type="tel"
              required
              dir="ltr"
              placeholder="+971 50 000 0000"
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("industry")} htmlFor="ac-industry" required>
            <div className="relative">
              <select
                id="ac-industry"
                name="industry"
                required
                defaultValue=""
                className={`${fieldClass} appearance-none pe-11`}
              >
                <option value="" disabled>
                  {t("industry")}
                </option>
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
          <Field label={t("consultant")} htmlFor="ac-consultant" required>
            <input
              id="ac-consultant"
              name="consultant"
              type="text"
              required
              className={fieldClass}
            />
          </Field>
        </div>

        {status === "blocked" && (
          <NotConnectedNotice
            title={t("notConnectedTitle")}
            body={t("notConnectedBody")}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={status === "working"}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-coral px-6 text-sm font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "working" ? t("creating") : t("createCta")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-6 text-sm font-bold text-heading transition-colors hover:border-navy/40 sm:w-auto"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
