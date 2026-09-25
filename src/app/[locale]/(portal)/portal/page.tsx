import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { buildPortalData, relativeParts } from "@/lib/portal";
import { numberLocale } from "@/lib/format";
import { JourneyStair } from "@/components/portal/JourneyStair";
import { TurnCard } from "@/components/portal/TurnCard";
import { NextSessionCard } from "@/components/portal/NextSessionCard";
import { DeliverablesPreview } from "@/components/portal/DeliverablesPreview";
import { PortalGreeting } from "@/components/portal/PortalGreeting";
import { Icon, type IconName } from "@/components/Icon";

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

export default async function PortalOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OverviewContent />;
}

function OverviewContent() {
  const t = useTranslations("portal");
  const tServices = useTranslations("servicesOverview");
  const locale = useLocale();
  const { client, journey, turn, nextSession, deliverables } =
    buildPortalData();

  const industry = (
    tServices.raw("items") as { key: string; title: string }[]
  ).find((s) => s.key === client.industry)?.title;

  // The deadline sentence belongs to the turn card but is computed here so the
  // card itself stays free of date maths.
  const dueISO = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const rel = relativeParts(dueISO, Date.now());
  const unitKey = rel.unit[0].toUpperCase() + rel.unit.slice(1);
  const dueLabel =
    turn === "firm"
      ? t("turn.waitingSince", {
          date: new Intl.DateTimeFormat(numberLocale(locale), {
            day: "numeric",
            month: "short",
          }).format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
        })
      : // ICU plural picks the right Arabic form (dual, few, many) from the
        // number itself — a "_one" suffix cannot express يومان.
        t(`turn.dueIn${unitKey}` as "turn.dueInDay", {
          value: Math.abs(rel.value),
        });

  const quickActions: { key: string; icon: IconName; href: string }[] = [
    { key: "upload", icon: "upload", href: "/portal/resources" },
    { key: "book", icon: "calendar", href: "/portal/bookings" },
    { key: "message", icon: "message", href: "/contact" },
    { key: "invoice", icon: "receipt", href: "/portal/profile" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Greeting */}
      <header>
        <PortalGreeting />
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          {t("greeting.sub", {
            company: t("client.company"),
            industry: industry ?? "",
          })}
        </p>
      </header>

      {/* 1 — Whose move is it. The page opens on the only thing that might
             need doing right now. */}
      <div className="mt-6 sm:mt-8">
        <TurnCard turn={turn} dueLabel={dueLabel} />
      </div>

      {/* 2 — Where the engagement stands */}
      <div className="mt-5 sm:mt-6">
        <JourneyStair journey={journey} />
      </div>

      {/* 3 — What's next and what's new, side by side on wide screens */}
      <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-2">
        <NextSessionCard session={nextSession} />
        <DeliverablesPreview items={deliverables} />
      </div>

      {/* 4 — Shortcuts, last: they are for people who already know what they
             came to do, so they never compete with the guided path above. */}
      <section aria-labelledby="actions-heading" className="mt-5 sm:mt-6">
        <h2
          id="actions-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("actions.title")}
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
                  {t(`actions.${action.key}` as "actions.upload")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
