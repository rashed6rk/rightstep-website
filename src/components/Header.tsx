"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { Container, CtaButton } from "./ui";

const navItems = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/workshops", key: "workshops" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * Current query string, read on the client.
 *
 * `usePathname` deliberately omits search params, so a language switch built
 * from it silently drops them — on checkout that means losing the workshop the
 * visitor already chose. Reading `window.location.search` after mount keeps
 * the switcher on a static route (no `useSearchParams` Suspense boundary).
 */
function useCurrentQuery(pathname: string) {
  const [query, setQuery] = useState<Record<string, string>>({});
  useEffect(() => {
    setQuery(Object.fromEntries(new URLSearchParams(window.location.search)));
  }, [pathname]);
  return query;
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const query = useCurrentQuery(pathname);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  // Home / Services / About all open on a navy hero, so until the header gains
  // its white backing on scroll it must render on-dark or it disappears into
  // the hero. Contact opens on a light surface, so it stays dark-on-light.
  const lightHero = pathname.startsWith("/contact");
  const onDark = !scrolled && !open && !lightHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // No body scroll-lock here on purpose: the drawer is an inline dropdown
  // beneath the header rather than a full-screen overlay, and locking `body`
  // while it carries `overflow-x: hidden` throws away the scroll position.
  // What a dropdown does owe the user is a way out — Escape and a click
  // anywhere outside it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--ease-step)] ${
        scrolled || open
          ? "border-b border-line bg-white/95 shadow-[0_1px_0_rgb(18_41_75_/_0.04)] backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4 sm:h-20">
          <Logo onDark={onDark} />

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={t("menu")}
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                    onDark
                      ? active
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "text-heading"
                        : "text-ink-muted hover:text-heading"
                  }`}
                >
                  {t(item.key)}
                  {/* Active marker: a single small tread under the label */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-teal transition-transform duration-300 ease-[var(--ease-step)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={{ pathname, query }}
              locale={otherLocale}
              className={`inline-flex min-h-10 items-center rounded-lg border px-3 text-xs font-bold transition-colors sm:text-sm ${
                onDark
                  ? "border-white/25 text-white hover:border-teal-bright hover:text-teal-bright"
                  : "border-line text-heading hover:border-teal hover:text-teal"
              }`}
            >
              {t("switchTo")}
            </Link>

            {/* Sign-in sits as a quiet text link, not a second button: the
                page has one primary action and it is Book Now. */}
            <Link
              href="/login"
              className={`hidden min-h-10 items-center px-2 text-sm font-semibold transition-colors lg:inline-flex ${
                onDark
                  ? "text-white/75 hover:text-white"
                  : "text-ink-muted hover:text-heading"
              }`}
            >
              {t("signIn")}
            </Link>

            <div className="hidden lg:block">
              <CtaButton href="/contact" className="!px-5 !py-2.5 !text-sm">
                {t("cta")}
              </CtaButton>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("close") : t("menu")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors lg:hidden ${
                onDark
                  ? "border-white/25 text-white hover:border-white/60"
                  : "border-line text-heading hover:border-navy/40"
              }`}
            >
              <span className="sr-only">{open ? t("close") : t("menu")}</span>
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <Container>
          <nav className="flex flex-col py-4" aria-label={t("menu")}>
            {navItems.map((item, i) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-2 py-3.5 text-base font-semibold transition-colors ${
                    active ? "text-heading" : "text-ink-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-0.5 rounded-full bg-gold"
                    style={{ width: `${10 + i * 6}px` }}
                  />
                  {t(item.key)}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg px-2 py-3.5 text-base font-semibold text-ink-muted transition-colors"
            >
              <span
                aria-hidden="true"
                className="h-0.5 w-8 rounded-full bg-teal"
              />
              {t("signIn")}
            </Link>

            <CtaButton href="/contact" className="mt-3 w-full">
              {t("cta")}
            </CtaButton>
          </nav>
        </Container>
      </div>
    </header>
  );
}
