import { useLocale, useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { numberLocale } from "@/lib/format";
import { PageHero } from "./PageHero";
import { Icon } from "./Icon";
import { Container } from "./ui";

type Section = { h: string; p: string };

/**
 * Shared shell for Privacy and Terms.
 *
 * Set at a reading measure rather than the site's marketing width — these are
 * pages people actually read top to bottom, and 65ch beats a full-width column
 * for that. A jump list runs alongside on wide screens so a specific clause can
 * be found without scrolling the whole document.
 */
export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const t = useTranslations(`legal.${kind}`);
  const tLegal = useTranslations("legal");
  const locale = useLocale();
  const sections = t.raw("sections") as Section[];

  const updated = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date("2026-08-11"));

  const slug = (i: number) => `clause-${i + 1}`;

  return (
    <>
      <PageHero title={t("title")} body={t("lead")} />

      <section className="bg-surface py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
            {/* Jump list — sticky on desktop, a plain list on mobile. */}
            <nav
              aria-labelledby="clauses-heading"
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <h2
                id="clauses-heading"
                className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
              >
                {t("title")}
              </h2>
              <ol className="mt-4 flex flex-col gap-1">
                {sections.map((section, i) => (
                  <li key={section.h}>
                    <a
                      href={`#${slug(i)}`}
                      className="block rounded-lg py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-heading"
                    >
                      {section.h}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-line pt-4 text-xs text-ink-faint">
                {tLegal("updated", { date: updated })}
              </p>
            </nav>

            <div className="min-w-0">
              {/* The client must not publish template legal text unreviewed,
                  so the warning sits above the content, not in a footnote. */}
              <div className="flex items-start gap-3.5 rounded-xl border border-gold-200 bg-gold-50 p-4">
                <Icon
                  name="secure"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink"
                />
                <p className="text-sm leading-relaxed text-ink">
                  {tLegal("reviewNotice")}
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-10">
                {sections.map((section, i) => (
                  <section key={section.h} id={slug(i)} className="scroll-mt-28">
                    <h2 className="text-xl font-bold text-heading sm:text-2xl">
                      {section.h}
                    </h2>
                    <p className="mt-3 max-w-[65ch] text-base leading-[1.75] text-pretty text-ink">
                      {section.p}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-12 rounded-2xl bg-surface-alt p-6 sm:p-7">
                <h2 className="text-lg font-bold text-heading">
                  {tLegal("contactTitle")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {tLegal("contactBody")}
                </p>
                <a
                  href={`mailto:${site.email}`}
                  dir="ltr"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-navy/20 px-4 py-2.5 text-sm font-bold text-heading transition-colors hover:border-navy/50 hover:bg-navy/[0.04]"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
