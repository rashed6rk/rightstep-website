import { useLocale, useTranslations } from "next-intl";
import { formatAmount, formatCount } from "@/lib/format";
import type { AdminData } from "@/lib/admin";
import { Icon, type IconName } from "../Icon";

/**
 * Four numbers, not a wall of them — the ones an owner actually checks first
 * thing: how many clients, how much money, how busy this week, and how many
 * people are stuck waiting on a reply. Everything else on the page explains
 * one of these four.
 */
export function StatsRow({ stats }: { stats: AdminData["stats"] }) {
  const t = useTranslations("admin.stats");
  const tWorkshops = useTranslations("workshops");
  const locale = useLocale();

  // `dataKey` reads the stats object; `labelKey` names the i18n string — kept
  // separate because the data field carries its unit ("...Aed") and the
  // translation key shouldn't.
  const items: {
    dataKey: keyof AdminData["stats"];
    labelKey: "activeClients" | "monthlyRevenue" | "sessionsThisWeek" | "needsAttention";
    icon: IconName;
    tone: string;
  }[] = [
    { dataKey: "activeClients", labelKey: "activeClients", icon: "clients", tone: "text-teal-ink" },
    { dataKey: "monthlyRevenueAed", labelKey: "monthlyRevenue", icon: "revenue", tone: "text-gold-ink" },
    { dataKey: "sessionsThisWeek", labelKey: "sessionsThisWeek", icon: "calendar", tone: "text-navy" },
    { dataKey: "needsAttention", labelKey: "needsAttention", icon: "attention", tone: "text-coral-ink" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.dataKey}
          className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-lg bg-surface-alt ${item.tone}`}
          >
            <Icon name={item.icon} className="h-4.5 w-4.5" />
          </span>
          <p className="mt-3 text-2xl font-extrabold tabular-nums text-heading sm:text-3xl">
            {item.dataKey === "monthlyRevenueAed"
              ? `${formatAmount(stats.monthlyRevenueAed, locale)} ${tWorkshops("currency")}`
              : formatCount(stats[item.dataKey], locale)}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-ink-muted sm:text-sm">
            {t(item.labelKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
