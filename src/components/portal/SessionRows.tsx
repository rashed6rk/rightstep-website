import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import type { PastSession, Session } from "@/lib/portal";
import { Icon } from "../Icon";

/**
 * One row per upcoming session — a lighter cousin of the Overview's
 * NextSessionCard. That card earns its size (countdown, live state, the one
 * meeting that matters right now); a list of several sessions needs a row
 * that scans, not a card that shouts.
 */
export function UpcomingSessionRow({ session }: { session: Session }) {
  const t = useTranslations("portal.bookings");
  const locale = useLocale();

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
  });
  const start = new Date(session.startISO);

  return (
    <li className="flex flex-col gap-3 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-ink">
          <Icon name="calendar" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-heading sm:text-base">
            {t(session.titleKey as "catalogueReview")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">
            {dateFmt.format(start)} · {timeFmt.format(start)} ·{" "}
            {t("withConsultant", { name: session.consultant })}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 ps-[3.375rem] sm:ps-0">
        <a
          href={session.meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-coral px-3.5 text-xs font-bold text-navy transition-colors hover:bg-coral-lift sm:text-sm"
        >
          <Icon name="video" className="h-4 w-4" />
          {t("join")}
        </a>
        <button
          type="button"
          aria-label={t("reschedule")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-navy/40 hover:text-heading"
        >
          <Icon name="reschedule" className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

/** A closed session, from the client's history — no join button, just what
 * happened and whether there is anything to read back. */
export function PastSessionRow({ session }: { session: PastSession }) {
  const t = useTranslations("portal.bookings");
  const locale = useLocale();

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="flex flex-col gap-3 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-700">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-heading sm:text-base">
            {t(session.titleKey as "planWalkthrough")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">
            {dateFmt.format(new Date(session.startISO))} ·{" "}
            {t("duration", { minutes: session.minutes })} ·{" "}
            {t("withConsultant", { name: session.consultant })}
          </p>
        </div>
      </div>

      <div className="shrink-0 ps-[3.375rem] sm:ps-0">
        {session.hasNotes ? (
          <a
            href="#"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3.5 text-xs font-bold text-heading transition-colors hover:border-navy/40 sm:text-sm"
          >
            <Icon name="external" className="h-4 w-4" />
            {t("viewNotes")}
          </a>
        ) : (
          <p className="text-xs text-ink-faint sm:text-sm">{t("noNotes")}</p>
        )}
      </div>
    </li>
  );
}
