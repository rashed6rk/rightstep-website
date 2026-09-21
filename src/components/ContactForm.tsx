"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { CheckIcon } from "./ui";

type Status = "idle" | "sending" | "sent";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors duration-200 placeholder:text-ink-faint focus:border-teal focus:outline-none";

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const services = t.raw("serviceOptions") as string[];
  const budgets = t.raw("budgetOptions") as string[];

  const [status, setStatus] = useState<Status>("idle");

  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const fd = new FormData(event.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      service: fd.get("service") as string,
      budget: fd.get("budget") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("sent");
        return;
      }
      throw new Error(json.error || "failed");
    } catch {
      // Fallback: open WhatsApp with the message
      const lines = [
        `الاسم: ${payload.name}`,
        `الإيميل: ${payload.email}`,
        payload.phone ? `الهاتف: ${payload.phone}` : "",
        `الخدمة: ${payload.service}`,
        payload.budget ? `الميزانية: ${payload.budget}` : "",
        `الرسالة: ${payload.message}`,
      ].filter(Boolean).join("\n");
      window.open(`${site.whatsapp}?text=${encodeURIComponent(lines)}`, "_blank");
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-8">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-extrabold text-heading">
          {t("successTitle")}
        </h3>
        <p className="text-sm leading-relaxed text-ink-muted">
          {t("successBody")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="inline-block py-1 text-sm font-bold text-teal-ink underline underline-offset-4 hover:text-heading"
        >
          {t("successAgain")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={false}
      className="flex min-w-0 flex-col gap-5 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-step)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={fieldClass}
          />
        </Field>

        <Field label={t("email")} htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label={t("phone")} htmlFor="phone">
        <input
          id="phone"
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          placeholder={t("phonePlaceholder")}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("service")} htmlFor="service" required>
          <select id="service" name="service" required className={fieldClass}>
            {services.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("budget")} htmlFor="budget">
          <select id="budget" name="budget" className={fieldClass}>
            {budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t("message")} htmlFor="message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 py-4 text-base font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {/* Form sends via WhatsApp + email */}
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-bold text-heading"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ms-1 text-coral-ink">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
