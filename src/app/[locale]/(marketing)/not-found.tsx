import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Icon } from "@/components/Icon";
import { Container, CtaButton } from "@/components/ui";

const suggestions = [
  { href: "/services", key: "services" },
  { href: "/workshops", key: "workshops" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * Branded 404 for the marketing site.
 *
 * A dead end is still a page someone landed on, so it does the one useful
 * thing available: says plainly what happened, then offers the four routes
 * they were most likely reaching for.
 */
export default function NotFound() {
  const t = useTranslations("notFound");
  const tNav = useTranslations("nav");

  return (
    <section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="flex max-w-2xl flex-col items-start py-20 sm:py-28">
          {/* A staircase with a missing tread — the brand motif, used to say
              something true about the situation rather than as decoration. */}
          <svg
            viewBox="0 0 120 64"
            fill="none"
            aria-hidden="true"
            className="h-16 w-auto rtl:-scale-x-100"
          >
            <rect x="2" y="46" width="26" height="16" rx="3" fill="#1596A0" />
            <rect
              x="32"
              y="30"
              width="26"
              height="32"
              rx="3"
              fill="#C9A227"
              opacity="0.35"
            />
            <rect
              x="32"
              y="30"
              width="26"
              height="32"
              rx="3"
              stroke="#C9A227"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <rect x="62" y="14" width="26" height="48" rx="3" fill="#E8873A" />
            <rect x="92" y="2" width="26" height="60" rx="3" fill="#12294B" />
          </svg>

          <h1 className="mt-8 text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.75rem]">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
            {t("body")}
          </p>

          <div className="mt-8">
            <CtaButton href="/">{t("home")}</CtaButton>
          </div>

          <div className="mt-12 w-full border-t border-line pt-8">
            <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
              {t("links")}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {suggestions.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm font-bold text-heading transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:border-line-strong"
                  >
                    {tNav(item.key)}
                    <Icon
                      name="arrow"
                      flipRtl
                      className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
