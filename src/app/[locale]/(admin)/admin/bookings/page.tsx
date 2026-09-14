import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import { buildAdminData } from "@/lib/admin";
import { Icon } from "@/components/Icon";
import { HonestActionButton } from "@/components/admin/HonestActionButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.admin" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BookingsContent />;
}

function BookingsContent() {
  const t = useTranslations("admin.bookingsPage");
  const locale = useLocale();
  const { bookings, clients } = buildAdminData();

  const clientOf = (id: string) => clients.find((c) => c.id === id);

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
  });

  // Grouped by calendar day, so the list reads as an agenda, not a pile.
  const groups = new Map<string, typeof bookings>();
  for (const booking of bookings) {
    const day = dateFmt.format(new Date(booking.startISO));
    groups.set(day, [...(groups.get(day) ?? []), booking]);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] leading-tight font-extrabold text-heading sm:text-[2.25rem]">
            {t("title")}
          </h1>
          <p className="mt-1.5 max-w-[58ch] text-sm text-ink-muted sm:text-base">
            {t("lead")}
          </p>
        </div>
        <HonestActionButton
          label={t("newBookingCta")}
          icon="plus"
          noticeTitleKey="notConnectedTitle"
          noticeBodyKey="notConnectedBody"
          namespace="admin.bookingsPage"
        />
      </header>

      {bookings.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-surface-alt p-8 text-center text-sm text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-8 sm:mt-8">
          {[...groups.entries()].map(([day, dayBookings]) => (
            <div key={day}>
              <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
                {day}
              </h2>
              <ul className="mt-3 flex flex-col rounded-2xl border border-line bg-surface">
                {dayBookings.map((booking) => {
                  const client = clientOf(booking.clientId);
                  return (
                    <li
                      key={booking.id}
                      className="flex flex-wrap items-center gap-3.5 border-t border-line p-4 first:border-t-0 sm:flex-nowrap"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-xs font-bold text-white">
                        {client?.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-heading">
                          {t("withClient", { name: client?.company ?? "" })}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          {timeFmt.format(new Date(booking.startISO))} ·{" "}
                          {t("consultant", { name: booking.consultant })}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <a
                          href={booking.meetUrl}
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
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
