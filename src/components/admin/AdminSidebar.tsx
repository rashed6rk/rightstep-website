"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Icon } from "../Icon";
import { LogoMark } from "../Logo";
import { adminNav } from "./nav";
import type { AdminStats } from "@/lib/api";

/**
 * Desktop sidebar for the owner's console. Carries the day's headline number
 * (who's waiting on them) at the bottom, the same way the client portal keeps
 * its journey miniature always in view — the one fact that matters most is
 * never more than a glance away, wherever in the console the owner is.
 */
export function AdminSidebar({ stats }: { stats: AdminStats }) {
  const t = useTranslations("admin.nav");
  const tAttention = useTranslations("admin.attention");
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-navy-800 bg-navy-950 lg:flex">
      {/* Same stacked layout as the client-portal sidebar so both admin
          consoles read as one family — logo carries the wordmark, section
          label drops beneath without wrapping at 256px. */}
      <div className="flex flex-col justify-center gap-1.5 border-b border-navy-800 px-6 py-4">
        <LogoMark className="h-7 w-auto" onDark />
        <span className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
          {t("dashboard")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label={t("menu")}>
        {adminNav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                active
                  ? "bg-navy-800 text-white"
                  : "text-white/70 hover:bg-navy-900 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {t(item.key)}
              {active && (
                <span
                  aria-hidden="true"
                  className="ms-auto h-5 w-1 rounded-full bg-coral"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-navy-800 p-5">
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
          {tAttention("title")}
        </p>
        <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
          {stats.needsAttention}
        </p>
      </div>
    </aside>
  );
}
