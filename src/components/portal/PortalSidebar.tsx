"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Icon } from "../Icon";
import { LogoMark } from "../Logo";
import { portalNav } from "./nav";
import { stepKeys, type JourneyStep } from "@/lib/portal";

/**
 * Desktop sidebar. Carries a miniature of the staircase at the bottom, so
 * wherever the client navigates they can still see which step they are on —
 * the portal's organising idea stays on screen instead of living on one page.
 */
export function PortalSidebar({ journey }: { journey: JourneyStep[] }) {
  const t = useTranslations("portal.nav");
  const tJourney = useTranslations("portal.journey");
  const tSteps = useTranslations("steps");
  const pathname = usePathname();

  const currentIndex = journey.findIndex((s) => s.status === "current");
  const steps = tSteps.raw("items") as { title: string }[];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-navy-800 bg-navy-950 lg:flex">
      {/* Wider header row now that the logo carries the wordmark itself; the
          section label drops beneath so nothing wraps on a 256px sidebar. */}
      <div className="flex flex-col justify-center gap-1.5 border-b border-navy-800 px-6 py-4">
        <LogoMark className="h-7 w-auto" onDark />
        <span className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
          {t("portal")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label={t("menu")}>
        {portalNav.map((item) => {
          const active =
            item.href === "/portal"
              ? pathname === "/portal"
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
                  className="ms-auto h-5 w-1 rounded-full bg-teal-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* The climb, in miniature */}
      <div className="border-t border-navy-800 p-5">
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
          {tJourney("title")}
        </p>
        <p className="mt-2 text-sm font-bold text-white">
          {steps[currentIndex]?.title}
        </p>
        <p className="mt-0.5 text-xs text-white/60">
          {tJourney("ofSteps", {
            n: currentIndex + 1,
            total: stepKeys.length,
          })}
        </p>

        <div
          aria-hidden="true"
          className="mt-4 flex items-end gap-1.5"
          role="presentation"
        >
          {journey.map((step, i) => (
            <span
              key={step.key}
              style={{ height: `${10 + i * 7}px` }}
              className={`flex-1 rounded-t ${
                step.status === "done"
                  ? "bg-teal-600"
                  : step.status === "current"
                    ? "bg-coral"
                    : "bg-navy-800"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
