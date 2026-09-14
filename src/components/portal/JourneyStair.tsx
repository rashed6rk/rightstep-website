"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale } from "@/lib/format";
import { stepKeys, type JourneyStep } from "@/lib/portal";
import { Icon } from "../Icon";

/**
 * The progress tracker, and the portal's organising idea.
 *
 * Wide screens get a real ascending staircase — each tread physically higher
 * than the last, the same language the marketing site uses. Narrow screens get
 * a vertical rail, because a four-column stair at 375px would still shrink
 * label to noise. Selecting a step reveals what came out of it below, so the
 * detail is one tap away rather than always on screen.
 *
 * Under RTL the grid reverses on its own, so the climb still runs in the
 * reading direction.
 */
export function JourneyStair({ journey }: { journey: JourneyStep[] }) {
  const t = useTranslations("portal.journey");
  const tSteps = useTranslations("steps");
  const locale = useLocale();
  const steps = tSteps.raw("items") as {
    title: string;
    body: string;
    deliverable: string;
  }[];

  const currentIndex = journey.findIndex((s) => s.status === "current");
  const [selected, setSelected] = useState(
    currentIndex >= 0 ? currentIndex : 0,
  );

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const statusLabel = (status: JourneyStep["status"]) =>
    status === "done"
      ? t("statusDone")
      : status === "current"
        ? t("statusCurrent")
        : t("statusUpcoming");

  return (
    <section
      aria-labelledby="journey-heading"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="journey-heading" className="text-lg font-bold text-heading">
          {t("title")}
        </h2>
        <p className="text-sm text-ink-muted">
          {t("ofSteps", { n: currentIndex + 1, total: stepKeys.length })}
        </p>
      </div>

      {/* ---------------- Wide: the staircase ---------------- */}
      <ol className="mt-7 hidden grid-cols-4 items-end gap-2.5 lg:grid">
        {journey.map((step, i) => {
          const isSelected = i === selected;
          const tone =
            step.status === "done"
              ? "bg-teal-600 text-white"
              : step.status === "current"
                ? "bg-coral text-navy"
                : "bg-ink-100 text-ink-700";
          return (
            <li key={step.key} className="flex h-full flex-col justify-end">
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                className={`rounded-xl border p-4 text-start transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-navy bg-navy-50"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold ${tone}`}
                >
                  {step.status === "done" ? (
                    <Icon name="check" className="h-4 w-4" />
                  ) : (
                    new Intl.NumberFormat(numberLocale(locale)).format(i + 1)
                  )}
                </span>
                <span className="mt-3 block text-sm leading-tight font-bold text-heading">
                  {steps[i]?.title}
                </span>
                <span className="mt-1 block text-xs text-ink-faint">
                  {statusLabel(step.status)}
                </span>
              </button>

              {/* The riser this tread stands on. */}
              <span
                aria-hidden="true"
                style={{ height: `${i * 16}px` }}
                className={`mt-2 rounded-t ${
                  step.status === "done"
                    ? "bg-teal-600"
                    : step.status === "current"
                      ? "bg-coral"
                      : "bg-ink-200"
                }`}
              />
            </li>
          );
        })}
      </ol>

      {/* ---------------- Narrow: the rail ---------------- */}
      <ol className="mt-6 flex flex-col lg:hidden">
        {journey.map((step, i) => {
          const isSelected = i === selected;
          const last = i === journey.length - 1;
          const tone =
            step.status === "done"
              ? "bg-teal-600 text-white"
              : step.status === "current"
                ? "bg-coral text-navy"
                : "bg-ink-100 text-ink-700";
          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                className="flex w-full gap-3.5 text-start"
              >
                <span className="flex flex-col items-center">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${tone}`}
                  >
                    {step.status === "done" ? (
                      <Icon name="check" className="h-4 w-4" />
                    ) : (
                      new Intl.NumberFormat(numberLocale(locale)).format(i + 1)
                    )}
                  </span>
                  {!last && (
                    <span
                      aria-hidden="true"
                      className={`my-1 w-0.5 flex-1 rounded-full ${
                        step.status === "done" ? "bg-teal-300" : "bg-ink-200"
                      }`}
                    />
                  )}
                </span>

                <span
                  className={`mb-2 flex-1 rounded-xl border px-4 py-3 transition-colors ${
                    isSelected
                      ? "border-navy bg-navy-50"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <span className="block text-sm font-bold text-heading">
                    {steps[i]?.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {statusLabel(step.status)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ---------------- What came out of the selected step ---------------- */}
      <div className="mt-5 rounded-xl bg-surface-alt p-5">
        <p className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
          {steps[selected]?.title}
        </p>
        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink">
          {steps[selected]?.body}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
          {journey[selected]?.completedOn && (
            <span className="text-ink-muted">
              {t("completedOn", {
                date: dateFmt.format(new Date(journey[selected].completedOn)),
              })}
            </span>
          )}
          <span className="text-ink-muted">
            {journey[selected]?.deliverables
              ? t("deliverables", { count: journey[selected].deliverables })
              : t("noDeliverables")}
          </span>
          {journey[selected]?.deliverables > 0 && (
            <Link
              href="/portal/resources"
              className="group/link ms-auto inline-flex min-h-6 items-center gap-1.5 py-1 font-bold text-heading transition-colors hover:text-coral-ink"
            >
              {t("viewFiles")}
              <Icon
                name="arrow"
                flipRtl
                className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
