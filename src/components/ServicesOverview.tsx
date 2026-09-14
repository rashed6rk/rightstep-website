import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/site";
import { ServiceIcon } from "./Icon";
import { ArrowIcon, Container, SectionHeading } from "./ui";

type ServiceItem = {
  key: ServiceKey;
  title: string;
  tagline: string;
  body: string;
  points: string[];
};

/**
 * Editorial rows, not a card grid. Three equal cards of icon-heading-text is
 * the default every generated page lands on; a ruled list lets the service
 * names run at display size and gives the copy room to be read.
 */
const accents = ["text-teal-ink", "text-gold-ink", "text-heading"] as const;

export function ServicesOverview() {
  const t = useTranslations("servicesOverview");
  const items = t.raw("items") as ServiceItem[];

  return (
    <section id="services" className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading title={t("title")} body={t("body")} />

        <div className="mt-14 sm:mt-16">
          {items.map((item, i) => (
            <article
              key={item.key}
              className="group grid gap-6 border-t border-line py-10 last:border-b sm:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
            >
              <div>
                {/* Each row starts a step further in — the list climbs. */}
                <div
                  className="flex items-start gap-3"
                  style={{ paddingInlineStart: `${i * 10}px` }}
                >
                  <ServiceIcon
                    service={item.key}
                    className={`mt-2 h-6 w-6 shrink-0 ${accents[i]}`}
                  />
                  <div>
                    <h3 className="text-[1.75rem] leading-[1.05] font-bold text-heading sm:text-[2.15rem]">
                      {item.title}
                    </h3>
                    <p className={`mt-2 text-base font-semibold ${accents[i]}`}>
                      {item.tagline}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="max-w-[58ch] text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
                  {item.body}
                </p>

                <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-line pt-2.5 text-sm text-ink"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/services"
                  className="group/link mt-7 inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral"
                >
                  {t("linkLabel")}
                  <ArrowIcon className="group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
