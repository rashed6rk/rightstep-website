"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/site";
import { VAT_RATE, formatAmount, formatCount } from "@/lib/format";
import { Icon, ServiceIcon, type IconName } from "./Icon";
import { Field, fieldClass } from "./Field";
import { NotConnectedNotice } from "./AuthNotice";
import { ArrowIcon, Container } from "./ui";

export type Workshop = {
  id: string;
  practice: ServiceKey;
  title: string;
  date: string;
  dateISO: string;
  duration: string;
  location: string;
  level: string;
  seats: string;
  amount: number;
};

type Method = "card" | "wallet" | "bank";

const methodIcons: Record<Method, IconName> = {
  card: "card",
  wallet: "wallet",
  bank: "bank",
};

export function CheckoutClient({
  workshop,
  practiceName,
  maxSeats,
}: {
  workshop: Workshop;
  practiceName: string;
  maxSeats: number;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  // Read once at the top: hooks must not be called conditionally or inside JSX.
  const currency = useTranslations("workshops")("currency");

  const [seats, setSeats] = useState(1);
  const [method, setMethod] = useState<Method>("card");
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  const isFree = workshop.amount === 0;
  const subtotal = workshop.amount * seats;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = subtotal + vat;

  const money = (v: number) => formatAmount(v, locale);
  const count = (v: number) => formatCount(v, locale);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("working");
    // TODO: create the order server-side, then hand the amount to the gateway.
    // The amount must be recalculated on the server — never trust a total that
    // arrived from the browser.
    window.setTimeout(() => setStatus("blocked"), 700);
  }

  return (
    <section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="py-10 sm:py-14">
          <Link
            href="/workshops"
            className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-semibold text-ink-muted transition-colors hover:text-heading"
          >
            <ArrowIcon className="rotate-180 group-hover/link:-translate-x-0.5 rtl:rotate-0" />
            {t("backLink")}
          </Link>

          <h1 className="mt-5 text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.5rem]">
            {t("title")}
          </h1>

          <StepTrail current={0} />

          <form
            onSubmit={handleSubmit}
            className="mt-10 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
          >
            {/* ================= Details + payment ================= */}
            <div className="flex min-w-0 flex-col gap-8">
              <fieldset className="flex flex-col gap-5">
                <legend className="mb-1 text-lg font-bold text-heading">
                  {t("attendeeTitle")}
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("fullName")} htmlFor="co-name" required>
                    <input
                      id="co-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label={t("email")} htmlFor="co-email" required>
                    <input
                      id="co-email"
                      name="email"
                      type="email"
                      required
                      dir="ltr"
                      autoComplete="email"
                      className={fieldClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("phone")} htmlFor="co-phone" required>
                    <input
                      id="co-phone"
                      name="phone"
                      type="tel"
                      required
                      dir="ltr"
                      autoComplete="tel"
                      placeholder="+971 50 000 0000"
                      className={fieldClass}
                    />
                  </Field>
                  <Field
                    label={t("organisation")}
                    htmlFor="co-org"
                    optionalLabel={t("optional")}
                  >
                    <input
                      id="co-org"
                      name="organisation"
                      type="text"
                      autoComplete="organization"
                      className={fieldClass}
                    />
                  </Field>
                </div>

                <Field
                  label={t("notes")}
                  htmlFor="co-notes"
                  optionalLabel={t("optional")}
                >
                  <textarea
                    id="co-notes"
                    name="notes"
                    rows={3}
                    placeholder={t("notesPlaceholder")}
                    className={`${fieldClass} resize-y`}
                  />
                </Field>
              </fieldset>

              {/* Free workshops skip payment entirely rather than showing a
                  zero-value card form nobody needs to fill in. */}
              {!isFree && (
                <fieldset className="flex flex-col gap-4">
                  <legend className="mb-1 text-lg font-bold text-heading">
                    {t("paymentTitle")}
                  </legend>

                  <div
                    role="radiogroup"
                    aria-label={t("paymentTitle")}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {(
                      [
                        ["card", t("methodCard")],
                        ["wallet", t("methodApple")],
                        ["bank", t("methodBank")],
                      ] as [Method, string][]
                    ).map(([value, label]) => {
                      const active = method === value;
                      return (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors duration-200 ${
                            active
                              ? "border-navy bg-navy-50"
                              : "border-line hover:border-line-strong"
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={value}
                            checked={active}
                            onChange={() => setMethod(value)}
                            className="sr-only"
                          />
                          <Icon
                            name={methodIcons[value]}
                            className={`h-5 w-5 ${
                              active ? "text-heading" : "text-ink-faint"
                            }`}
                          />
                          <span
                            className={`text-sm font-bold ${
                              active ? "text-heading" : "text-ink-muted"
                            }`}
                          >
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {method === "card" && <GatewayMount />}

                  {method === "wallet" && (
                    <p className="rounded-xl bg-surface-alt p-4 text-sm leading-relaxed text-ink-muted">
                      {t("appleBody")}
                    </p>
                  )}

                  {method === "bank" && (
                    <p className="rounded-xl bg-surface-alt p-4 text-sm leading-relaxed text-ink-muted">
                      {t("bankBody")}
                    </p>
                  )}
                </fieldset>
              )}
            </div>

            {/* ================= Order summary ================= */}
            <aside className="min-w-0 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-step)] sm:p-7">
                <h2 className="text-lg font-bold text-heading">
                  {t("summaryTitle")}
                </h2>

                <div className="mt-5 border-t border-line pt-5">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-teal-ink">
                    <ServiceIcon
                      service={workshop.practice}
                      className="h-4 w-4"
                    />
                    {practiceName}
                  </span>
                  <h3 className="mt-2.5 text-lg leading-[1.2] font-bold text-balance text-heading">
                    {workshop.title}
                  </h3>
                  <dl className="mt-4 flex flex-col gap-2 text-sm">
                    <SummaryRow icon="clock" value={workshop.date} />
                    <SummaryRow icon="pin" value={workshop.location} />
                    <SummaryRow icon="level" value={workshop.duration} />
                  </dl>
                </div>

                {/* Seat stepper */}
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-5">
                  <div>
                    <p className="text-sm font-bold text-heading">
                      {t("seatsLabel")}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {workshop.seats} {t("seatsHint")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StepperButton
                      label={t("seatDecrease")}
                      icon="minus"
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      disabled={seats <= 1}
                    />
                    <span
                      aria-live="polite"
                      aria-label={`${t("seatsLabel")}: ${count(seats)}`}
                      className="w-10 text-center text-base font-bold tabular-nums text-heading"
                    >
                      {count(seats)}
                    </span>
                    <StepperButton
                      label={t("seatIncrease")}
                      icon="plus"
                      onClick={() =>
                        setSeats((s) => Math.min(maxSeats, s + 1))
                      }
                      disabled={seats >= maxSeats}
                    />
                  </div>
                </div>

                {/* Totals */}
                <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-sm">
                  {isFree ? (
                    <div className="flex items-baseline justify-between">
                      <dt className="font-bold text-heading">{t("total")}</dt>
                      <dd className="text-xl font-bold text-teal-ink">
                        {t("free")}
                      </dd>
                    </div>
                  ) : (
                    <>
                      <TotalRow
                        label={t("subtotal")}
                        value={money(subtotal)}
                        currency={currency}
                      />
                      <TotalRow
                        label={t("vat")}
                        value={money(vat)}
                        currency={currency}
                      />
                      <div className="mt-1.5 flex items-baseline justify-between border-t border-line pt-3.5">
                        <dt className="text-base font-bold text-heading">
                          {t("total")}
                        </dt>
                        <dd className="text-2xl font-bold tabular-nums text-heading">
                          {money(total)}{" "}
                          <span className="text-sm font-semibold text-ink-muted">
                            {currency}
                          </span>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>

                {status === "blocked" && (
                  <div className="mt-5 flex flex-col gap-3">
                    <NotConnectedNotice
                      title={t("notConnectedTitle")}
                      body={t("notConnectedBody")}
                    />
                    {/* Keeps the built confirmation screen reachable without
                        faking a successful payment to get there. */}
                    <Link
                      href="/checkout/confirmation"
                      className="inline-flex min-h-8 items-center gap-1.5 py-1 text-sm font-bold text-heading underline underline-offset-4 transition-colors hover:text-coral-ink"
                    >
                      {t("previewConfirmation")}
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "working"}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-coral px-6 py-4 text-base font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "working"
                    ? t("placing")
                    : isFree
                      ? t("placeFree")
                      : t("place")}
                </button>

                {!isFree && (
                  <p className="mt-3.5 flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
                    <Icon name="secure" className="mt-0.5 h-4 w-4" />
                    {t("secureNote")}
                  </p>
                )}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                {t("demoNotice")}
              </p>
            </aside>
          </form>
        </div>
      </Container>
    </section>
  );
}

function SummaryRow({ icon, value }: { icon: IconName; value: string }) {
  return (
    <div className="flex items-center gap-2 text-ink">
      <Icon name={icon} className="h-4 w-4 text-ink-faint" />
      <span>{value}</span>
    </div>
  );
}

function TotalRow({
  label,
  value,
  currency,
}: {
  label: string;
  value: string;
  currency: string;
}) {
  return (
    <div className="flex items-baseline justify-between text-ink-muted">
      <dt>{label}</dt>
      <dd className="tabular-nums">
        {value} <span className="text-xs">{currency}</span>
      </dd>
    </div>
  );
}

function StepperButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: IconName;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-lg border border-line text-heading transition-colors hover:border-navy/40 hover:bg-navy/[0.04] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-transparent"
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

/**
 * Where the payment gateway's own card fields mount.
 *
 * This is intentionally empty. Card numbers must be entered into inputs served
 * by the gateway inside its own frame — collecting them in our own inputs would
 * put this application in PCI-DSS scope and put card data on our servers.
 */
function GatewayMount() {
  const t = useTranslations("checkout");
  return (
    <div className="rounded-xl border-2 border-dashed border-line-strong bg-surface-alt p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-heading">
        <Icon name="card" className="h-4.5 w-4.5 text-ink-faint" />
        {t("cardMountTitle")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {t("cardMountBody")}
      </p>
    </div>
  );
}

/** The three checkout stages, drawn as the same climb the brand uses. */
function StepTrail({ current }: { current: number }) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const steps = t.raw("steps") as string[];

  return (
    <ol className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-3">
            <span className="flex items-center gap-2.5">
              <span
                className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                  active
                    ? "bg-navy text-white"
                    : done
                      ? "bg-teal-ink text-white"
                      : "bg-ink-100 text-ink-700"
                }`}
              >
                {done ? (
                  <Icon name="check" className="h-3.5 w-3.5" />
                ) : (
                  formatCount(i + 1, locale)
                )}
              </span>
              <span
                className={`text-sm font-semibold ${
                  active ? "text-heading" : "text-ink-faint"
                }`}
              >
                {step}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden h-px w-8 bg-line sm:block"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
