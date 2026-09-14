import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/site";
import { formatAmount } from "@/lib/format";
import { Icon, ServiceIcon, type IconName } from "@/components/Icon";
import { Container, CtaButton } from "@/components/ui";

type Workshop = {
  id: string;
  practice: ServiceKey;
  title: string;
  date: string;
  dateISO: string;
  duration: string;
  location: string;
  level: string;
  seats: string;
  amount: number;
  blurb: string;
  forWho: string;
  takeaway: string;
  agenda: string[];
};

async function getWorkshop(locale: string, id: string) {
  const tw = await getTranslations({ locale, namespace: "workshops" });
  const items = tw.raw("items") as Workshop[];
  return items.find((item) => item.id === id);
}

/** Every workshop in every locale is known at build time, so prerender them. */
export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    const tw = await getTranslations({ locale, namespace: "workshops" });
    for (const item of tw.raw("items") as Workshop[]) {
      params.push({ locale, id: item.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const workshop = await getWorkshop(locale, id);
  if (!workshop) return { title: "Right Step" };
  return {
    title: `${workshop.title} — Right Step`,
    description: workshop.blurb,
  };
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "workshopDetail" });
  const tw = await getTranslations({ locale, namespace: "workshops" });
  const tServices = await getTranslations({
    locale,
    namespace: "servicesOverview",
  });
  const workshop = await getWorkshop(locale, id);

  // A retired workshop is an ordinary outcome once the schedule rolls over,
  // so it gets a helpful page rather than a 404.
  if (!workshop) {
    return (
      <section className="bg-surface pt-[72px] sm:pt-20">
        <Container>
          <div className="flex max-w-xl flex-col items-start gap-5 py-20 sm:py-28">
            <h1 className="text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.5rem]">
              {t("notFound")}
            </h1>
            <p className="text-base leading-relaxed text-ink-muted">
              {t("notFoundBody")}
            </p>
            <CtaButton href="/workshops">{t("notFoundCta")}</CtaButton>
          </div>
        </Container>
      </section>
    );
  }

  const practiceName =
    (tServices.raw("items") as { key: ServiceKey; title: string }[]).find(
      (s) => s.key === workshop.practice,
    )?.title ?? "";

  const isFree = workshop.amount === 0;
  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar", label: "", value: workshop.date },
    { icon: "clock", label: "", value: workshop.duration },
    { icon: "pin", label: "", value: workshop.location },
    { icon: "level", label: "", value: workshop.level },
    {
      icon: "seats",
      label: "",
      value: `${workshop.seats} ${t("seatsLeft")}`,
    },
  ];

  return (
    <>
      {/* --- Hero --- */}
      <section className="relative overflow-hidden bg-navy pt-[72px] text-white sm:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="tread-lines absolute inset-0 opacity-60" />
          <div className="absolute -top-24 end-[-8%] h-80 w-80 rounded-full bg-teal/20 blur-[110px]" />
        </div>

        <Container className="relative">
          <div className="max-w-3xl py-14 sm:py-20">
            <Link
              href="/workshops"
              className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <Icon
                name="arrow"
                className="h-4 w-4 rotate-180 transition-transform group-hover/link:-translate-x-0.5 rtl:rotate-0"
              />
              {t("backLink")}
            </Link>

            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-bright">
              <ServiceIcon service={workshop.practice} className="h-4.5 w-4.5" />
              {practiceName}
            </span>

            <h1 className="mt-3 text-[2.25rem] leading-[1.02] font-extrabold text-balance sm:text-[3rem]">
              {workshop.title}
            </h1>

            <p className="on-dark-text mt-5 max-w-[58ch] text-base text-white/75 sm:text-lg">
              {workshop.blurb}
            </p>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="riser-top -mt-px h-14 w-full bg-surface"
        />
      </section>

      {/* --- Body --- */}
      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="min-w-0 flex flex-col gap-10">
              {/* Agenda, numbered as a climb rather than a bulleted list. */}
              <div>
                <h2 className="text-xl font-bold text-heading sm:text-2xl">
                  {t("agendaTitle")}
                </h2>
                <ol className="mt-5 flex flex-col">
                  {workshop.agenda.map((line, i) => (
                    <li
                      key={line}
                      className="flex gap-4 border-t border-line py-4"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-xs font-bold text-heading">
                        {new Intl.NumberFormat(
                          locale === "ar" ? "ar-u-nu-arab" : "en",
                        ).format(i + 1)}
                      </span>
                      <span className="text-base leading-relaxed text-pretty text-ink">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-alt p-6">
                  <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
                    {t("forWhoTitle")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-ink">
                    {workshop.forWho}
                  </p>
                </div>
                <div className="rounded-2xl bg-teal-50 p-6">
                  <h2 className="text-xs font-bold tracking-[0.14em] text-teal-ink uppercase">
                    {t("takeawayTitle")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-ink">
                    {workshop.takeaway}
                  </p>
                </div>
              </div>
            </div>

            {/* --- Booking panel. Sticky on desktop; on mobile it simply sits
                    after the content, and the sticky bar below takes over. --- */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-step)] sm:p-7">
                <p className="text-3xl font-bold tabular-nums text-heading">
                  {isFree ? (
                    <span className="text-teal-ink">{t("freeLabel")}</span>
                  ) : (
                    <>
                      {formatAmount(workshop.amount, locale)}{" "}
                      <span className="text-base font-semibold text-ink-muted">
                        {tw("currency")}
                      </span>
                    </>
                  )}
                </p>

                <h2 className="mt-6 text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
                  {t("detailsTitle")}
                </h2>
                <dl className="mt-3 flex flex-col gap-2.5 border-t border-line pt-4 text-sm">
                  {facts.map((fact) => (
                    <dd
                      key={fact.value}
                      className="flex items-center gap-2.5 text-ink"
                    >
                      <Icon
                        name={fact.icon}
                        className="h-4 w-4 shrink-0 text-ink-faint"
                      />
                      {fact.value}
                    </dd>
                  ))}
                </dl>

                <CtaButton
                  href={`/checkout?w=${workshop.id}`}
                  className="mt-6 w-full"
                >
                  {t("bookCta")}
                </CtaButton>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Mobile booking bar: the price and the action stay reachable however
          far down the outline someone has read. */}
      <div className="sticky bottom-0 z-20 border-t border-line bg-white/95 p-3 backdrop-blur-lg lg:hidden">
        <Container>
          <div className="flex items-center gap-3">
            <p className="shrink-0 text-lg font-bold tabular-nums text-heading">
              {isFree ? (
                <span className="text-teal-ink">{tw("free")}</span>
              ) : (
                <>
                  {formatAmount(workshop.amount, locale)}{" "}
                  <span className="text-xs font-semibold text-ink-muted">
                    {tw("currency")}
                  </span>
                </>
              )}
            </p>
            <CtaButton
              href={`/checkout?w=${workshop.id}`}
              className="ms-auto !px-5 !py-3 !text-sm"
            >
              {t("bookCta")}
            </CtaButton>
          </div>
        </Container>
      </div>
    </>
  );
}
