import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";
import { BrandMark } from "./Icon";
import { Container } from "./ui";

const socials = [
  { name: "LinkedIn" as const, href: site.social.linkedin },
  { name: "Instagram" as const, href: site.social.instagram },
  { name: "X" as const, href: site.social.x },
];

const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/workshops", key: "workshops" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tMeta = useTranslations("meta");
  const tServices = useTranslations("servicesOverview");
  const services = tServices.raw("items") as { key: string; title: string }[];
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-deep text-white">
      {/* Rising edge into the footer — the last tread of the page. */}
      <div
        aria-hidden="true"
        className="riser-bottom -mt-14 h-14 w-full bg-surface"
      />

      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            {/* Lockup carries the wordmark itself, so no separate name text
                sits next to it. The slogan drops beneath, aligned to the mark. */}
            <div className="flex flex-col gap-2">
              <LogoMark className="h-9 w-auto" onDark />
              <span className="text-[10px] font-medium tracking-wide text-white/60">
                {tMeta("slogan")}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {t("tagline")}
            </p>

            <div className="mt-1">
              <p className="mb-2.5 text-xs font-bold tracking-[0.14em] text-white/60 uppercase">
                {t("social")}
              </p>
              <ul className="flex items-center gap-2.5">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-bright hover:text-teal-bright"
                    >
                      <BrandMark name={social.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-nav">
            <h2
              id="footer-nav"
              className="mb-4 text-xs font-bold tracking-[0.14em] text-white/60 uppercase"
            >
              {t("navTitle")}
            </h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/portal"
                  className="inline-block py-1 text-sm text-white/70 transition-colors hover:text-teal-bright"
                >
                  {tNav("portal")}
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="inline-block py-1 text-sm text-white/70 transition-colors hover:text-teal-bright"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="mb-4 text-xs font-bold tracking-[0.14em] text-white/60 uppercase"
            >
              {t("servicesTitle")}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    href={`/services#${service.key}`}
                    className="inline-block py-1 text-sm text-white/70 transition-colors hover:text-teal-bright"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-white/60 uppercase">
              {t("contactTitle")}
            </h2>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={`tel:${site.phone}`}
                  dir="ltr"
                  className="inline-block py-1 font-semibold text-white transition-colors hover:text-teal-bright"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  dir="ltr"
                  className="inline-block py-1 break-all text-white/70 transition-colors hover:text-teal-bright"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-3 py-2 text-white/80 transition-colors hover:border-teal-bright hover:text-teal-bright"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t("rights")}
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <Link
                href="/privacy"
                className="inline-block py-1 transition-colors hover:text-white"
              >
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="inline-block py-1 transition-colors hover:text-white"
              >
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
