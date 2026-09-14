"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import { relativeParts, sessionPhase, type Session } from "@/lib/portal";
import { Icon } from "../Icon";

/**
 * The next session, as a card that knows what time it is.
 *
 * A static "your meeting is on Tuesday" row makes people go hunting through
 * email for the Meet link at 9:58. Instead the card changes job as the meeting
 * approaches: information → preparation → one large Join button → follow-up.
 *
 * The clock only ticks while a meeting is near. Far-future sessions do not
 * need a per-second re-render, and a dashboard left open all day should not
 * burn battery counting down to something two days away.
 */
export function NextSessionCard({ session }: { session: Session }) {
  const t = useTranslations("portal.session");
  const locale = useLocale();

  // Start from the server-rendered value to avoid a hydration mismatch, then
  // let the client take over once mounted.
  const [now, setNow] = useState(() => new Date(session.startISO).getTime());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const tick = () => setNow(Date.now());
    const distance = new Date(session.startISO).getTime() - Date.now();
    // Second-by-second only inside the last two hours; otherwise every minute.
    const interval = Math.abs(distance) < 2 * 60 * 60 * 1000 ? 1000 : 60_000;
    const id = window.setInterval(tick, interval);
    return () => window.clearInterval(id);
  }, [session.startISO]);

  const phase = mounted
    ? sessionPhase(session.startISO, session.minutes, now)
    : "future";
  const rel = relativeParts(session.startISO, now);
  // ICU plural, so Arabic gets ساعتان rather than "2 ساعات".
  const unitKey = rel.unit[0].toUpperCase() + rel.unit.slice(1);
  const countdown = Math.abs(rel.value);

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
  });
  const start = new Date(session.startISO);

  const urgent = phase === "soon" || phase === "live";

  return (
    <section
      aria-labelledby="session-heading"
      className={`flex flex-col rounded-2xl border p-5 transition-colors duration-500 sm:p-6 ${
        urgent ? "border-coral-200 bg-coral-50" : "border-line bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="session-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("title")}
        </h2>
        {mounted && urgent && (
          <span className="inline-flex items-center gap-2 rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-navy">
            {phase === "live" && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy"
              />
            )}
            {phase === "live"
              ? t("live")
              : t(`startsIn${unitKey}` as "startsInHour", { value: countdown })}
          </span>
        )}
      </div>

      <p className="mt-4 text-lg leading-tight font-bold text-balance text-heading">
        {t(session.titleKey as "catalogueReview")}
      </p>

      <dl className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-ink">
          <Icon name="calendar" className="h-4 w-4 text-ink-faint" />
          <span>
            {dateFmt.format(start)} · {timeFmt.format(start)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-ink">
          <Icon name="clock" className="h-4 w-4 text-ink-faint" />
          <span>{t("duration", { minutes: session.minutes })}</span>
        </div>
        <div className="flex items-center gap-2 text-ink">
          <Icon name="user" className="h-4 w-4 text-ink-faint" />
          <span>{t("withConsultant", { name: session.consultant })}</span>
        </div>
      </dl>

      {phase === "ended" ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-sm text-ink-muted">{t("ended")}</p>
          <a
            href="#"
            className="group mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-navy/20 px-4 py-2.5 text-sm font-bold text-heading transition-colors hover:border-navy/50 hover:bg-navy/[0.04]"
          >
            <Icon name="video" className="h-4 w-4" />
            {t("viewNotes")}
          </a>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4">
          {/* Joining is the only thing that matters once the meeting is close,
              so it becomes the filled button and everything else steps back. */}
          <a
            href={session.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 ${
              urgent
                ? "bg-coral text-navy shadow-[var(--shadow-cta)] hover:bg-coral-lift"
                : "border border-navy/20 text-navy hover:border-navy/50 hover:bg-navy/[0.04]"
            }`}
          >
            <Icon name="video" className="h-4.5 w-4.5" />
            {phase === "live" ? t("joinNow") : t("join")}
          </a>

          <div className="flex flex-wrap gap-2">
            <a
              href={session.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink-muted transition-colors hover:border-navy/40 hover:text-heading"
            >
              <Icon name="calendar" className="h-4 w-4" />
              {t("addToCalendar")}
            </a>
            <button
              type="button"
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink-muted transition-colors hover:border-navy/40 hover:text-heading"
            >
              {t("reschedule")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
