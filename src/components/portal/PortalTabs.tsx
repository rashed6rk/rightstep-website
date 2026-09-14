"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Icon } from "../Icon";
import { portalNav } from "./nav";

/**
 * Mobile navigation: a fixed bottom tab bar rather than a hamburger drawer.
 *
 * Four destinations, always visible, inside thumb reach — one tap to anywhere
 * instead of two, and no hidden state to remember. The drawer pattern is kept
 * for the account sheet in the top bar, where the items are secondary.
 *
 * `pb-[env(safe-area-inset-bottom)]` keeps the row clear of the iOS home
 * indicator; without it the last few pixels of each tab are unreachable.
 */
export function PortalTabs() {
  const t = useTranslations("portal.nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("menu")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      <ul className="flex">
        {portalNav.map((item) => {
          const active =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[3.75rem] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold transition-colors ${
                  active ? "text-heading" : "text-ink-faint"
                }`}
              >
                {/* The active tread sits above the icon — the same marker the
                    marketing nav uses, flipped to suit a bottom bar. */}
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-6 rounded-full transition-colors ${
                    active ? "bg-coral" : "bg-transparent"
                  }`}
                />
                <Icon name={item.icon} className="h-5.5 w-5.5" />
                <span className="leading-none">{t(item.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
