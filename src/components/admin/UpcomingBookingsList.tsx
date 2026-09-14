import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale } from "@/lib/format";
import type { AdminBooking } from "@/lib/admin";
import { Icon } from "../Icon";

/**
 * The next few sessions across every client and every consultant — the
 * calendar an owner would otherwise keep in a separate app. This is the
 * short version shown on the Overview; the full list with reschedule lives
 * on /admin/bookings.
 */
export function UpcomingBookingsList({
  bookings,
  clientName,
}: {
  bookings: AdminBooking[];
  clientName: (clientId: string) => string;
}) {
  const t = useTranslations("admin.todaySessions");
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

  return (
    <section
      aria-labelledby="upcoming-heading"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <h2
        id="upcoming-heading"
        className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
      >
        {t("title")}
      </h2>

      {bookings.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-1 flex flex-col">
          {bookings.slice(0, 4).map((booking) => {
            const start = new Date(booking.startISO);
            return (
              <li
                key={booking.id}
                className="flex items-center gap-3.5 border-t border-line py-3 first:border-t-0"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800">
                  <Icon name="calendar" className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-heading">
                    {t("withClient", { name: clientName(booking.clientId) })}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {dateFmt.format(start)} · {timeFmt.format(start)}
                  </span>
                </span>
                <a
                  href={booking.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-bold text-heading transition-colors hover:border-navy/40"
                >
                  <Icon name="video" className="h-3.5 w-3.5" />
                  {t("join")}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/admin/bookings"
        className="group/link mt-4 inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
      >
        {t("viewAll")}
        <Icon
          name="arrow"
          flipRtl
          className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
        />
      </Link>
    </section>
  );
}
