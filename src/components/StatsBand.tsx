import { useTranslations } from "next-intl";
import { Container, SectionHeading } from "./ui";

type Stat = { value: string; label: string };

/**
 * The figures read as sentences, not as a row of metric tiles. A big-number
 * grid says nothing a reader can act on; setting the number inside the claim
 * keeps the evidence attached to the point it supports.
 */
export function StatsBand() {
  const t = useTranslations("stats");
  const items = t.raw("items") as Stat[];

  return (
    <section className="bg-surface-alt py-20 sm:py-28">
      <Container>
        <SectionHeading title={t("title")} body={t("body")} />

        <ul className="mt-12 grid gap-x-14 sm:mt-14 lg:grid-cols-2">
          {items.map((item, i) => (
            <li
              key={item.value + i}
              className="flex items-baseline gap-4 border-t border-line py-6 sm:gap-5"
            >
              <span
                className={`shrink-0 text-2xl font-bold tabular-nums sm:text-[1.75rem] ${
                  i % 2 === 0 ? "text-teal-ink" : "text-gold-ink"
                }`}
              >
                {item.value}
              </span>
              <span className="max-w-[52ch] text-sm leading-relaxed text-pretty text-ink sm:text-base">
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {t("footnote") && (
          <p className="mt-6 border-t border-line pt-5 text-xs text-ink-faint">
            {t("footnote")}
          </p>
        )}
      </Container>
    </section>
  );
}
