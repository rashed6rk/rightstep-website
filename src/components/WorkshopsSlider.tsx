"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ServiceKey } from "@/lib/site";
import { Icon, ServiceIcon, type IconName } from "./Icon";
import { ArrowIcon, Container, SectionHeading } from "./ui";

type Workshop = {
  id: string;
  practice: ServiceKey;
  title: string;
  date: string;
  dateISO: string;
  duration: string;
  location: string;
  level: string;
  price: string;
  seats: string;
  blurb: string;
};

// Same accent order the services list uses, so a workshop's colour tells you
// which practice runs it without needing a legend.
const accents: Record<ServiceKey, string> = {
  communication: "text-teal-ink",
  leadership: "text-heading",
  coaching: "text-coral-ink",
  corporate: "text-gold-ink",
  events: "text-gold-ink",
  supplier: "text-heading",
};
const rules: Record<ServiceKey, string> = {
  communication: "#1596A0",
  leadership: "#12294B",
  coaching: "#E8873A",
  corporate: "#C9A227",
  events: "#C9A227",
  supplier: "#12294B",
};

export function WorkshopsSlider() {
  const t = useTranslations("workshops");
  const tServices = useTranslations("servicesOverview");
  const items = t.raw("items") as Workshop[];
  const practiceNames = Object.fromEntries(
    (tServices.raw("items") as { key: ServiceKey; title: string }[]).map(
      (s) => [s.key, s.title],
    ),
  ) as Record<ServiceKey, string>;

  const trackRef = useRef<HTMLUListElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // scrollLeft runs negative under RTL in spec-compliant browsers, so the
    // distance travelled is its absolute value in both directions.
    const travelled = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(travelled <= 2);
    setAtEnd(travelled >= max - 2);
  }, []);

  const touched = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();

    const markTouched = () => {
      touched.current = true;
    };
    el.addEventListener("scroll", sync, { passive: true });
    el.addEventListener("pointerdown", markTouched, { passive: true });
    el.addEventListener("wheel", markTouched, { passive: true });
    el.addEventListener("keydown", markTouched);
    window.addEventListener("resize", sync);

    // Landing on /#workshops makes the browser reveal focus inside this
    // scroller and shunts the row to its far end. The list must always open on
    // the first card — unless the visitor has already started scrolling it.
    const settle = window.setTimeout(() => {
      if (!touched.current) {
        el.scrollTo({ left: 0 });
        sync();
      }
    }, 500);

    return () => {
      window.clearTimeout(settle);
      el.removeEventListener("scroll", sync);
      el.removeEventListener("pointerdown", markTouched);
      el.removeEventListener("wheel", markTouched);
      el.removeEventListener("keydown", markTouched);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: step * direction * (rtl ? -1 : 1), behavior: "smooth" });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Arrow keys follow the reading direction, matching what the buttons do.
    if (event.key === "ArrowRight") {
      event.preventDefault();
      page(getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      page(getComputedStyle(event.currentTarget).direction === "rtl" ? 1 : -1);
    }
  };

  if (items.length === 0) return null;

  return (
    <section
      id="workshops"
      className="scroll-mt-28 bg-surface py-20 sm:py-28"
    >
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading title={t("title")} body={t("body")} />

          <div className="flex shrink-0 items-center gap-2">
            <SliderButton
              onClick={() => page(-1)}
              disabled={atStart}
              label={t("prev")}
              direction="prev"
            />
            <SliderButton
              onClick={() => page(1)}
              disabled={atEnd}
              label={t("next")}
              direction="next"
            />
          </div>
        </div>
      </Container>

      {/* The track lives inside the container so card edges line up with every
          other section. A fixed card width leaves the next one peeking, which
          is what tells people the row scrolls. */}
      <Container className="mt-10 sm:mt-12">
        <ul
          ref={trackRef}
          tabIndex={0}
          role="group"
          onKeyDown={onKeyDown}
          aria-label={t("title")}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const accent = accents[item.practice];
            const isFree = !item.price;

            return (
              <li
                key={item.dateISO + item.title}
                data-card
                className="w-72 shrink-0 snap-start sm:w-[21rem]"
              >
                <article
                  className="flex h-full flex-col border-t-2 pt-5"
                  style={{ borderTopColor: rules[item.practice] }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-bold ${accent}`}
                    >
                      <ServiceIcon
                        service={item.practice}
                        className="h-4 w-4"
                      />
                      {practiceNames[item.practice]}
                    </span>
                    {isFree && (
                      <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-bold text-teal-ink">
                        {t("free")}
                      </span>
                    )}
                  </div>

                  <time
                    dateTime={item.dateISO}
                    className="mt-5 block text-sm font-bold text-heading"
                  >
                    {item.date}
                  </time>

                  <h3 className="mt-2 text-xl leading-[1.15] font-bold text-balance text-heading">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-pretty text-ink-muted">
                    {item.blurb}
                  </p>

                  {/* Each fact gets its own glyph, so the four can be told
                      apart at a glance instead of read line by line. */}
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-4 text-sm">
                    <Meta icon="pin" label={item.location} />
                    <Meta icon="clock" label={item.duration} />
                    <Meta icon="level" label={item.level} />
                    <Meta
                      icon="seats"
                      label={`${item.seats} ${t("seatsLeft")}`}
                    />
                  </dl>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-base font-bold text-heading">
                      {isFree ? (
                        t("free")
                      ) : (
                        <>
                          {item.price}{" "}
                          <span className="text-sm font-semibold text-ink-muted">
                            {t("currency")}
                          </span>
                        </>
                      )}
                    </p>
                    <Link
                      href={{ pathname: "/checkout", query: { w: item.id } }}
                      className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
                    >
                      {t("cta")}
                      <ArrowIcon className="group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>

      <Container>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">{t("note")}</p>
          <Link
            href="/contact"
            className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
          >
            {t("allCta")}
            <ArrowIcon className="group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Meta({ icon, label }: { icon: IconName; label: string }) {
  return (
    <dd className="flex items-center gap-2 text-ink">
      <Icon name={icon} className="h-4 w-4 text-ink-faint" />
      <span className="min-w-0 truncate">{label}</span>
    </dd>
  );
}

function SliderButton({
  onClick,
  disabled,
  label,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-xl border border-line text-heading transition-all duration-300 ease-[var(--ease-step)] hover:border-navy/40 hover:bg-navy/[0.04] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-transparent"
    >
      <ArrowIcon
        className={`h-4.5 w-4.5 group-hover:translate-x-0 ${
          direction === "prev" ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
