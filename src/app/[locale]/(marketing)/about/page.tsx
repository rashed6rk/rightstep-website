import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { site } from "@/lib/site";
import { ArrowIcon, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPageContent />;
}

type Value = { title: string; body: string };
type Journey = { audience: string; from: string; to: string; body: string };

function AboutPageContent() {
  const t = useTranslations("aboutPage");
  const values = t.raw("values.items") as Value[];
  const journeys = t.raw("journeys.items") as Journey[];

  return (
    <>
      <PageHero title={t("hero.title")} body={t("hero.body")} />

      {/* ---------- Vision & Mission ----------
          Two panels, deliberately unequal in weight: the vision is the quiet
          belief, the mission is the commitment, so the mission gets the navy. */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex h-full flex-col justify-center gap-4 rounded-2xl border border-line bg-surface p-7 sm:p-10">
              <h2 className="text-[1.75rem] leading-[1.08] font-bold text-heading sm:text-[2.15rem]">
                {t("vision.title")}
              </h2>
              <p className="max-w-[54ch] text-base leading-relaxed text-pretty text-ink-muted">
                {t("vision.body")}
              </p>
            </article>

            <article className="flex h-full flex-col justify-center gap-4 rounded-2xl bg-navy p-7 text-white sm:p-10">
              <h2 className="text-[1.75rem] leading-[1.08] font-bold text-balance sm:text-[2.15rem]">
                {t("mission.title")}
              </h2>
              <p className="max-w-[54ch] text-base leading-relaxed text-pretty text-white/75">
                {t("mission.body")}
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* ---------- Values ---------- */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading title={t("values.title")} />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => {
              const accents = [
                "border-t-teal bg-teal-50/50",
                "border-t-gold bg-gold-50/50",
                "border-t-navy bg-navy-50/50",
                "border-t-coral bg-coral-50/50",
                "border-t-teal bg-teal-50/50",
              ];
              const glyphs = ["◆", "●", "▲", "■", "✦"];
              const glyphColors = ["text-teal-ink", "text-gold-ink", "text-navy-800", "text-coral-ink", "text-teal-ink"];
              return (
                <li
                  key={value.title}
                  className={`rounded-2xl border border-line border-t-[3px] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-step)] ${accents[i % accents.length]}`}
                >
                  <span className={`text-lg ${glyphColors[i % glyphColors.length]}`}>{glyphs[i % glyphs.length]}</span>
                  <h3 className="mt-3 text-lg font-bold text-heading">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                    {value.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ---------- The three journeys ---------- */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading title={t("journeys.title")} />

          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {journeys.map((journey, i) => {
              const bgs = ["bg-navy", "bg-navy-deep", "bg-navy"];
              const accents = ["text-teal-bright", "text-gold", "text-coral"];
              return (
                <li key={journey.audience}>
                  <article className={`flex h-full flex-col rounded-2xl ${bgs[i]} p-7 text-white sm:p-8`}>
                    <h3 className={`text-xl font-bold ${accents[i]}`}>
                      {journey.audience}
                    </h3>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="flex-1 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white/70">
                        {journey.from}
                      </span>
                      <ArrowIcon className={`h-4 w-4 shrink-0 ${accents[i]} rtl:rotate-180`} />
                      <span className="flex-1 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-bold text-white">
                        {journey.to}
                      </span>
                    </div>

                    <p className="mt-5 flex-1 text-sm leading-relaxed text-pretty text-white/65">
                      {journey.body}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ---------- Abu Dhabi ---------- */}
      <section className="bg-surface pb-16 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-navy-deep px-6 py-12 text-white sm:px-10 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="tread-lines absolute inset-0 opacity-70" />
              <div className="absolute -bottom-20 end-[-5%] h-72 w-72 rounded-full bg-teal/20 blur-[110px]" />
            </div>
            <div className="relative flex max-w-2xl flex-col gap-4">
              <h2 className="text-[1.75rem] leading-[1.08] font-bold text-balance sm:text-[2.4rem]">
                {t("location.title")}
              </h2>
              <p className="max-w-[58ch] text-base leading-relaxed text-pretty text-white/75">
                {t("location.body")}
              </p>
              <a
                href={`tel:${site.phone}`}
                dir="ltr"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
