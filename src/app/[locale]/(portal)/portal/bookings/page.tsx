import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { buildPortalData } from "@/lib/portal";
import { UpcomingSessionRow, PastSessionRow } from "@/components/portal/SessionRows";
import { BookingEngine } from "@/components/portal/BookingEngine";
import { Icon } from "@/components/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.portal" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BookingsContent />;
}

function BookingsContent() {
  const t = useTranslations("portal.bookings");
  const { upcomingSessions, pastSessions } = buildPortalData();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-heading sm:text-[2.25rem]">
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-[58ch] text-sm text-ink-muted sm:text-base">
          {t("lead")}
        </p>
      </header>

      <div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-2">
        {/* Upcoming — what the client actually opens this page to check. */}
        <section
          aria-labelledby="upcoming-heading"
          className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
        >
          <h2
            id="upcoming-heading"
            className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
          >
            {t("upcomingTitle")}
          </h2>
          {upcomingSessions.length === 0 ? (
            <div className="mt-4 flex flex-col items-start gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-ink">
                <Icon name="calendar" className="h-5 w-5" />
              </span>
              <p className="mt-1 text-sm font-bold text-heading">
                {t("noUpcoming")}
              </p>
              <p className="text-sm text-ink-muted">{t("noUpcomingBody")}</p>
            </div>
          ) : (
            <ul className="mt-1 flex flex-col">
              {upcomingSessions.map((session) => (
                <UpcomingSessionRow key={session.id} session={session} />
              ))}
            </ul>
          )}
        </section>

        {/* History — a quieter section, read less often. */}
        <section
          aria-labelledby="history-heading"
          className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
        >
          <h2
            id="history-heading"
            className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
          >
            {t("historyTitle")}
          </h2>
          {pastSessions.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">{t("noHistory")}</p>
          ) : (
            <ul className="mt-1 flex flex-col">
              {pastSessions.map((session) => (
                <PastSessionRow key={session.id} session={session} />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-5 sm:mt-6">
        <BookingEngine />
      </div>
    </div>
  );
}
