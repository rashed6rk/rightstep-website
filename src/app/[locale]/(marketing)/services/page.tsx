import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { ServiceKey } from "@/lib/site";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/PageHero";
import { WorkshopsSlider } from "@/components/WorkshopsSlider";
import { StepsStaircase } from "@/components/StepsStaircase";
import { CtaBand } from "@/components/CtaBand";
import { ServiceIcon } from "@/components/Icon";
import { ArrowIcon, Container } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.services" });
  return { title: t("title"), description: t("description") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageContent />;
}

type Overview = {
  key: ServiceKey;
  title: string;
  tagline: string;
  body: string;
  points: string[];
};

/**
 * Per-service accent — one hue each, held to a small palette drawn from the
 * brand ramps. Kept as icon-plaque tints (soft background + strong glyph)
 * because the cards themselves stay light: the identity comes from the icon
 * tile, not from a whole coloured wall.
 */
const plaques: Record<ServiceKey, { bg: string; fg: string }> = {
  communication: { bg: "bg-teal-50", fg: "text-teal-ink" },
  leadership: { bg: "bg-navy-50", fg: "text-navy-800" },
  coaching: { bg: "bg-coral-50", fg: "text-coral-ink" }, // Personal Development
  corporate: { bg: "bg-gold-50", fg: "text-gold-ink" },
  events: { bg: "bg-teal-50", fg: "text-teal-ink" },
  supplier: { bg: "bg-gold-50", fg: "text-gold-ink" },
};

function ServicesPageContent() {
  const tHero = useTranslations("servicesPage.hero");
  const tDetail = useTranslations("servicesPage.detail");
  const tOverview = useTranslations("servicesOverview");

  const overviews = tOverview.raw("items") as Overview[];

  return (
    <>
      <PageHero title={tHero("title")} body={tHero("body")} />

      {/* -------------------------------------------------------------------
          The service grid: enterprise-consultancy grammar — a clean 3-up on
          desktop, each service reduced to identity + a single-sentence promise
          + a link into the conversation. The kind of layout McKinsey, PwC and
          Deloitte use on their "What we do" pages: quiet, factual, scannable.
          Detail lives one click away (the contact form), not stacked on the
          page itself.
      ------------------------------------------------------------------- */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {overviews.map((service) => {
              const plaque = plaques[service.key];
              return (
                <li key={service.key} id={service.key} className="scroll-mt-28">
                  <Link
                    href={{ pathname: "/contact", query: { s: service.key } }}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-step)] sm:p-7"
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${plaque.bg}`}
                    >
                      <ServiceIcon
                        service={service.key}
                        className={`h-6 w-6 ${plaque.fg}`}
                      />
                    </span>

                    <h2 className="mt-5 text-xl leading-[1.2] font-bold text-balance text-heading sm:text-[1.4rem]">
                      {service.title}
                    </h2>
                    <p className={`mt-1.5 text-sm font-semibold ${plaque.fg}`}>
                      {service.tagline}
                    </p>

                    <p className="mt-3 text-[15px] leading-relaxed text-pretty text-ink-muted">
                      {service.body}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-heading transition-colors group-hover:text-coral-ink">
                      {tDetail("ctaLabel")}
                      <ArrowIcon />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <WorkshopsSlider />

      <StepsStaircase />
      <CtaBand />
    </>
  );
}
