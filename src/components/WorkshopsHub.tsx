"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/site";
import { formatAmount } from "@/lib/format";
import { Icon, ServiceIcon, type IconName } from "./Icon";
import { Container } from "./ui";

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
};

/** Rule colour that runs above each workshop row — one visual anchor per
 * practice. Communication is the flagship, so it gets the flagship colour
 * (teal). Coaching gets coral because it's the one-to-one, high-touch
 * offering — same argument as coral being the CTA elsewhere on the site. */
const rules: Record<ServiceKey, string> = {
  communication: "#1596A0",
  leadership: "#12294B",
  coaching: "#E8873A",
  corporate: "#C9A227",
  events: "#C9A227",
  supplier: "#12294B",
};
const accents: Record<ServiceKey, string> = {
  communication: "text-teal-ink",
  leadership: "text-heading",
  coaching: "text-coral-ink",
  corporate: "text-gold-ink",
  events: "text-gold-ink",
  supplier: "text-heading",
};

/**
 * The full schedule.
 *
 * The homepage slider is a teaser; this is where someone who has decided to
 * attend something actually chooses. Two filters only — practice and format —
 * because six workshops do not need a faceted search, and every extra control
 * is a decision the visitor has to make before seeing anything.
 *
 * Grouped by month so the list reads as a calendar rather than a pile.
 */
export function WorkshopsHub({ items }: { items: Workshop[] }) {
  const t = useTranslations("workshopsPage");
  const tw = useTranslations("workshops");
  const tServices = useTranslations("servicesOverview");
  const locale = useLocale();

  const services = tServices.raw("items") as { key: ServiceKey; title: string }[];
  const [practice, setPractice] = useState<ServiceKey | "all">("all");
  const [format, setFormat] = useState<"all" | "online" | "person">("all");

  const onlineWord = tw("online");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (practice !== "all" && item.practice !== practice) return false;
        if (format === "online" && item.location !== onlineWord) return false;
        if (format === "person" && item.location === onlineWord) return false;
        return true;
      }),
    [items, practice, format, onlineWord],
  );

  // Group by calendar month, preserving schedule order.
  const groups = useMemo(() => {
    const monthFmt = new Intl.DateTimeFormat(
      locale === "ar" ? "ar-u-nu-arab" : "en-AE",
      { month: "long", year: "numeric" },
    );
    const map = new Map<string, Workshop[]>();
    for (const item of filtered) {
      const label = monthFmt.format(new Date(item.dateISO));
      map.set(label, [...(map.get(label) ?? []), item]);
    }
    return [...map.entries()];
  }, [filtered, locale]);

  const active = practice !== "all" || format !== "all";

  return (
    <section className="bg-surface py-14 sm:py-20">
      <Container>
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-line pb-6">
          <FilterRow
            label={t("filterPractice")}
            options={[
              { value: "all", label: t("all") },
              ...services.map((s) => ({ value: s.key, label: s.title })),
            ]}
            value={practice}
            onChange={(v) => setPractice(v as ServiceKey | "all")}
          />
          <FilterRow
            label={t("filterFormat")}
            options={[
              { value: "all", label: t("all") },
              { value: "person", label: t("inPerson") },
              { value: "online", label: t("online") },
            ]}
            value={format}
            onChange={(v) => setFormat(v as "all" | "online" | "person")}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
            {filtered.length === 1
              ? t("resultsOne")
              : t("resultsOther", { count: filtered.length })}
          </p>
          {active && (
            <button
              type="button"
              onClick={() => {
                setPractice("all");
                setFormat("all");
              }}
              className="inline-flex min-h-8 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
            >
              <Icon name="close" className="h-4 w-4" />
              {t("clear")}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-surface-alt p-8 text-center text-sm text-ink-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-10">
            {groups.map(([month, monthItems]) => (
              <div key={month}>
                <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
                  {month}
                </h2>
                <ul className="mt-4 flex flex-col">
                  {monthItems.map((item) => (
                    <li key={item.id}>
                      <WorkshopRow
                        item={item}
                        practiceName={
                          services.find((s) => s.key === item.practice)?.title ??
                          ""
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Private sessions — the natural next question after browsing. */}
        <div className="mt-14 rounded-2xl bg-navy p-7 text-white sm:p-10">
          <h2 className="text-[1.5rem] leading-tight font-bold text-balance sm:text-[1.9rem]">
            {t("privateTitle")}
          </h2>
          <p className="on-dark-text mt-3 max-w-[56ch] text-sm text-white/75 sm:text-base">
            {t("privateBody")}
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-6 py-3.5 text-sm font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift sm:text-base"
          >
            {t("privateCta")}
            <Icon
              name="arrow"
              flipRtl
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`inline-flex min-h-9 items-center rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-navy bg-navy text-white"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-heading"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WorkshopRow({
  item,
  practiceName,
}: {
  item: Workshop;
  practiceName: string;
}) {
  const t = useTranslations("workshopsPage");
  const tw = useTranslations("workshops");
  const locale = useLocale();
  const isFree = item.amount === 0;

  const meta: { icon: IconName; value: string }[] = [
    { icon: "pin", value: item.location },
    { icon: "clock", value: item.duration },
    { icon: "level", value: item.level },
    { icon: "seats", value: `${item.seats} ${tw("seatsLeft")}` },
  ];

  return (
    <article
      className="grid gap-5 border-t-2 py-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-10"
      style={{ borderTopColor: rules[item.practice] }}
    >
      <div className="min-w-0">
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold ${accents[item.practice]}`}
        >
          <ServiceIcon service={item.practice} className="h-4 w-4" />
          {practiceName}
        </span>

        <time
          dateTime={item.dateISO}
          className="mt-3 block text-sm font-bold text-heading"
        >
          {item.date}
        </time>

        <h3 className="mt-1.5 text-[1.4rem] leading-[1.15] font-bold text-balance text-heading sm:text-[1.7rem]">
          {item.title}
        </h3>

        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-pretty text-ink-muted sm:text-base">
          {item.blurb}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {meta.map((m) => (
            <dd key={m.value} className="flex items-center gap-2 text-ink">
              <Icon name={m.icon} className="h-4 w-4 text-ink-faint" />
              {m.value}
            </dd>
          ))}
        </dl>
      </div>

      <div className="flex flex-col items-start gap-3 lg:items-end lg:text-end">
        <p className="text-2xl font-bold tabular-nums text-heading">
          {isFree ? (
            <span className="text-teal-ink">{tw("free")}</span>
          ) : (
            <>
              {formatAmount(item.amount, locale)}{" "}
              <span className="text-sm font-semibold text-ink-muted">
                {tw("currency")}
              </span>
            </>
          )}
        </p>

        <Link
          href={`/workshops/${item.id}`}
          className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-navy/20 px-5 py-2.5 text-sm font-bold text-heading transition-colors hover:border-navy/50 hover:bg-navy/[0.04] sm:w-auto"
        >
          {t("detailsCta")}
          <Icon
            name="arrow"
            flipRtl
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
