"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale } from "@/lib/format";
import { relativeParts } from "@/lib/portal";
import { getPortalDashboard, type PortalDashboard } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { JourneyStair } from "./JourneyStair";
import { TurnCard } from "./TurnCard";
import { NextSessionCard } from "./NextSessionCard";
import { DeliverablesPreview } from "./DeliverablesPreview";
import { PortalGreeting } from "./PortalGreeting";
import { Icon, type IconName } from "@/components/Icon";
import { OverviewSkeleton } from "./Skeleton";

export function PortalOverviewData() {
  const t = useTranslations("portal");
  const tServices = useTranslations("servicesOverview");
  const locale = useLocale();
  const { user } = useAuth();
  const [data, setData] = useState<PortalDashboard | null>(null);

  useEffect(() => {
    getPortalDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <OverviewSkeleton />;

  const industry = data.profile
    ? (tServices.raw("items") as { key: string; title: string }[]).find(
        (s) => s.key === data.profile!.industry,
      )?.title
    : "";

  const turn = data.turn;
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
      : t(`turn.dueIn${unitKey}` as "turn.dueInDay", {
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
      <header>
        <PortalGreeting />
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          {t("greeting.sub", {
            company: data.profile?.company ?? "",
            industry: industry ?? "",
          })}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <TurnCard turn={turn} dueLabel={dueLabel} />
      </div>

      <div className="mt-5 sm:mt-6">
        <JourneyStair journey={data.journey} />
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-2">
        {data.nextSession && <NextSessionCard session={data.nextSession} />}
        <DeliverablesPreview items={data.deliverables} />
      </div>

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
