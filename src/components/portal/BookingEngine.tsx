"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import { sessionTypes, type SessionType } from "@/lib/portal";
import { Icon, type IconName } from "../Icon";
import { NotConnectedNotice } from "../AuthNotice";

const typeIcon: Record<SessionType["key"], IconName> = {
  quick: "clock",
  full: "video",
  workshop: "workshop",
};

/** Business hours, in the consultant's local slots — every 45 minutes so a
 * quick and a full session both land on a clean boundary. */
const DAY_SLOTS = ["09:00", "09:45", "11:00", "13:30", "14:15", "16:00"];

/**
 * Booking engine: pick a session type, a day, a time, confirm.
 *
 * Built for a real Google Calendar integration to slot in without a rewrite —
 * `handleSubmit` is the one place that would call the calendar API with
 * `{ type, dateISO, time }`; everything above it is pure UI state. Two days
 * are pre-blocked (see `blockedDays`) to prove the grid can express
 * unavailability, the way a real freebusy lookup would.
 */
export function BookingEngine() {
  const t = useTranslations("portal.bookings");
  const locale = useLocale();

  const [type, setType] = useState<SessionType["key"]>("full");
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "blocked">("idle");

  const days = useMemo(() => {
    const out: { iso: string; blocked: boolean }[] = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      // Weekends in the UAE are Friday/Saturday — blocked, same as a real
      // freebusy calendar would report them.
      const blocked = d.getDay() === 5 || d.getDay() === 6;
      out.push({ iso: d.toISOString(), blocked });
    }
    return out;
  }, []);

  const dayFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "short",
    day: "numeric",
  });
  const activeDay = days[dayIndex];
  const slots = activeDay.blocked ? [] : DAY_SLOTS;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!time) return;
    setStatus("working");
    // TODO: POST { type, dateISO: activeDay.iso, time } to the calendar
    // provider, then create the event and email the invite.
    window.setTimeout(() => setStatus("blocked"), 700);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <h2 className="text-lg font-bold text-heading">
        {t("newBookingTitle")}
      </h2>
      <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
        {t("newBookingLead")}
      </p>

      {/* Step 1 — session type */}
      <div
        role="radiogroup"
        aria-label={t("newBookingTitle")}
        className="mt-6 grid gap-3 sm:grid-cols-3"
      >
        {sessionTypes.map((option) => {
          const active = type === option.key;
          const nameKey =
            `type${option.key[0].toUpperCase()}${option.key.slice(1)}Name` as "typeQuickName";
          const descKey =
            `type${option.key[0].toUpperCase()}${option.key.slice(1)}Desc` as "typeQuickDesc";
          return (
            <label
              key={option.key}
              className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors duration-200 ${
                active
                  ? "border-navy bg-navy-50"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <input
                type="radio"
                name="sessionType"
                value={option.key}
                checked={active}
                onChange={() => {
                  setType(option.key);
                  setTime(null);
                }}
                className="sr-only"
              />
              <span className="flex items-center gap-2.5">
                <Icon
                  name={typeIcon[option.key]}
                  className={`h-5 w-5 ${active ? "text-heading" : "text-ink-faint"}`}
                />
                <span className="text-sm font-bold text-heading">
                  {t(nameKey)}
                </span>
              </span>
              <span className="text-xs leading-relaxed text-ink-muted">
                {t(descKey)}
              </span>
              <span className="text-xs font-bold text-teal-ink">
                {t("minutesShort", { minutes: option.durationMinutes })}
              </span>
            </label>
          );
        })}
      </div>

      {/* Step 2 — day */}
      <h3 className="mt-7 text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
        {t("pickDateTitle")}
      </h3>
      <div
        role="radiogroup"
        aria-label={t("pickDateTitle")}
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
      >
        {days.map((day, i) => {
          const active = i === dayIndex;
          return (
            <button
              key={day.iso}
              type="button"
              disabled={day.blocked}
              onClick={() => {
                setDayIndex(i);
                setTime(null);
              }}
              aria-pressed={active}
              className={`min-w-[4.5rem] shrink-0 rounded-xl border px-3 py-2.5 text-center text-xs font-bold transition-colors ${
                day.blocked
                  ? "cursor-not-allowed border-line text-ink-faint opacity-50"
                  : active
                    ? "border-navy bg-navy text-white"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-heading"
              }`}
            >
              {dayFmt.format(new Date(day.iso))}
            </button>
          );
        })}
      </div>

      {/* Step 3 — time */}
      <h3 className="mt-6 text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
        {t("pickTimeTitle")}
      </h3>
      {slots.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{t("noSlotsForDay")}</p>
      ) : (
        <div
          role="radiogroup"
          aria-label={t("pickTimeTitle")}
          className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6"
        >
          {slots.map((slot) => {
            const active = time === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                aria-pressed={active}
                dir="ltr"
                className={`rounded-lg border py-2.5 text-sm font-bold tabular-nums transition-colors ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-heading"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      {status === "blocked" && (
        <div className="mt-6">
          <NotConnectedNotice
            title={t("notConnectedTitle")}
            body={t("notConnectedBody")}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!time || status === "working"}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-coral px-6 py-3.5 text-sm font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto sm:px-8"
      >
        {status === "working" ? t("confirming") : t("confirmCta")}
      </button>
    </form>
  );
}
