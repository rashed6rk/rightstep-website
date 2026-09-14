"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Icon } from "../Icon";
import { adminNav } from "./nav";

/** Bottom tab bar for the owner's console on mobile — same pattern as the
 * client portal's, so switching between the two feels like one product. */
export function AdminTabs() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("menu")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      <ul className="flex">
        {adminNav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
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
