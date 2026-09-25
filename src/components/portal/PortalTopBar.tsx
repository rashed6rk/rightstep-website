"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Icon } from "../Icon";
import { LogoMark } from "../Logo";
import { useAuth } from "@/lib/auth-context";

function useCurrentQuery(pathname: string) {
  const [query, setQuery] = useState<Record<string, string>>({});
  useEffect(() => {
    setQuery(Object.fromEntries(new URLSearchParams(window.location.search)));
  }, [pathname]);
  return query;
}

export function PortalTopBar() {
  const t = useTranslations("portal.nav");
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const query = useCurrentQuery(pathname);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
    : "";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-lg">
        <div className="flex h-16 items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <LogoMark className="h-7 w-auto lg:hidden" />

          <div className="hidden max-w-md flex-1 lg:block">
            <label htmlFor="portal-search" className="sr-only">
              {t("search")}
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4.5 w-4.5 text-ink-faint"
              />
              <input
                id="portal-search"
                type="search"
                placeholder={t("search")}
                className="w-full rounded-xl border border-line bg-surface-alt py-2.5 ps-11 pe-4 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-teal focus:bg-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              href={{ pathname, query }}
              locale={otherLocale}
              className="inline-flex min-h-10 items-center rounded-lg border border-line px-3 text-xs font-bold text-heading transition-colors hover:border-teal hover:text-teal sm:text-sm"
            >
              {locale === "ar" ? "English" : "العربية"}
            </Link>

            <button
              type="button"
              aria-label={t("notifications")}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-line text-heading transition-colors hover:border-navy/40"
            >
              <Icon name="bell" className="h-5 w-5" />
              <span
                aria-hidden="true"
                className="absolute end-2 top-2 h-2 w-2 rounded-full bg-coral ring-2 ring-white"
              />
            </button>

            <button
              type="button"
              onClick={() => setSheetOpen((v) => !v)}
              aria-expanded={sheetOpen}
              aria-controls="portal-sheet"
              aria-label={t("menu")}
              className="flex min-h-10 items-center gap-2 rounded-lg border border-line ps-1.5 pe-2.5 py-1.5 transition-colors hover:border-navy/40"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-navy text-[11px] font-bold text-white">
                {initials}
              </span>
              <Icon
                name="chevron"
                className={`h-4 w-4 text-ink-faint transition-transform duration-200 ${
                  sheetOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {sheetOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-navy-950/20"
          />
          <div
            id="portal-sheet"
            className="fixed end-4 top-[4.5rem] z-40 w-64 rounded-2xl border border-line bg-white p-2 shadow-[var(--shadow-step-lg)] sm:top-[5.5rem]"
          >
            <div className="border-b border-line px-3 py-3">
              <p className="text-sm font-bold text-heading">{user?.name}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{user?.email}</p>
            </div>
            <SheetLink href="/portal/profile" icon="user" label={t("profile")} />
            <SheetLink href="/contact" icon="help" label={t("support")} />
            <SheetLink href="/" icon="external" label={t("backToSite")} />
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              onClick={() => {
                setSheetOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-alt hover:text-heading"
            >
              <Icon name="logout" className="h-4.5 w-4.5" />
              {t("signOut")}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function SheetLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "user" | "help" | "external";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-alt hover:text-heading"
    >
      <Icon name={icon} className="h-4.5 w-4.5" />
      {label}
    </Link>
  );
}
