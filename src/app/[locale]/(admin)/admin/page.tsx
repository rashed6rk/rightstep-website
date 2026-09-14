import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { buildAdminData, owner } from "@/lib/admin";
import { StatsRow } from "@/components/admin/StatsRow";
import { AttentionList } from "@/components/admin/AttentionList";
import { UpcomingBookingsList } from "@/components/admin/UpcomingBookingsList";
import { Icon, type IconName } from "@/components/Icon";

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

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OverviewContent />;
}

function OverviewContent() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { clients, bookings, stats } = buildAdminData();
  // Bilingual name — Arabic sentence reads with the Arabic form, English
  // sentence with the transliterated form, so the greeting doesn't mix scripts.
  const ownerDisplayName = locale === "ar" ? owner.name : owner.nameEn;

  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const waitingClients = clients.filter(
    (c) => c.status === "active" && c.turn === "client",
  );
  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.company ?? "";

  const quickActions: { key: string; icon: IconName; href: string }[] = [
    { key: "addClient", icon: "clients", href: "/admin/clients?new=1" },
    { key: "newBooking", icon: "calendar", href: "/admin/bookings" },
    { key: "uploadResource", icon: "upload", href: "/admin/resources" },
    { key: "viewAll", icon: "external", href: "/admin/clients" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-balance text-heading sm:text-[2.25rem]">
          {t(`greeting.${greetKey}` as "greeting.morning", { name: ownerDisplayName })}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          {t("greeting.sub")}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <StatsRow stats={stats} />
      </div>

      <div className="mt-5 sm:mt-6">
        <AttentionList clients={waitingClients} />
      </div>

      <div className="mt-5 sm:mt-6">
        <UpcomingBookingsList bookings={bookings} clientName={clientName} />
      </div>

      <section aria-labelledby="qa-heading" className="mt-5 sm:mt-6">
        <h2
          id="qa-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("quickActions.title")}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <li key={action.key}>
              <Link
                href={action.href}
                className="flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:border-line-strong"
              >
                <Icon name={action.icon} className="h-5 w-5 text-teal-ink" />
                <span className="text-sm font-bold text-heading">
                  {t(`quickActions.${action.key}` as "quickActions.addClient")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-ink-faint">
        {t("demoNotice")}
      </p>
    </div>
  );
}
