import { useTranslations } from "next-intl";
import { Container, CtaButton, GhostButton } from "./ui";

type Stat = { value: string; label: string };

/**
 * Text-forward hero — no illustration.
 *
 * Enterprise consultancy grammar (McKinsey, PwC, Deloitte, BCG): the headline
 * IS the visual. A cartoon or 3D scene competes with the message; big, quiet
 * typography and generous whitespace signal seniority. The stats sit as a
 * three-column footer inside the hero — "at a glance" evidence, not a data
 * dump — so the eye lands on the headline first, the promise second, and the
 * facts third, in that order.
 *
 * A single ascending riser motif on the ground plane keeps a whisper of the
 * "right step" brand idea without ever being cartoonish.
 */
export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className="relative overflow-hidden bg-navy pt-[72px] text-white sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tread-lines absolute inset-0 opacity-60" />
        <div className="absolute -top-40 end-[-6%] h-[520px] w-[520px] rounded-full bg-teal/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] start-[-10%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[130px]" />
      </div>

      <Container className="relative">
        <div className="flex flex-col py-16 sm:py-24 lg:py-32">
          {/* -------- Eyebrow ---------- */}
          <p className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase">
            {t("eyebrow")}
          </p>

          {/* -------- Headline ---------- */}
          <h1 className="mt-6 max-w-[22ch] text-[2.75rem] leading-[1.02] font-extrabold text-balance sm:text-[4.25rem] lg:text-[5.5rem]">
            {t("titleA")}{" "}
            <span className="relative inline-block text-gold">
              {t("titleHighlight")}
              <svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-2.5 w-full rtl:-scale-x-100"
              >
                <path
                  d="M2 10h60V7h60V4h76"
                  stroke="#E8873A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
            {t("titleB")}
          </h1>

          {/* -------- Deck ---------- */}
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-pretty text-white/75 sm:text-xl">
            {t("body")}
          </p>

          {/* -------- Slogan ---------- */}
          <p className="mt-5 text-base font-semibold text-teal-bright sm:text-lg">
            {t("slogan")}
          </p>

          {/* -------- CTAs ---------- */}
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <CtaButton href="/contact">{t("ctaPrimary")}</CtaButton>
            <GhostButton href="/services" onDark>
              {t("ctaSecondary")}
            </GhostButton>
          </div>

          <p className="mt-6 text-sm text-white/60">{t("trust")}</p>

          {/* -------- Stats — the "at a glance" panel ----------
              Three quiet facts inside a bordered strip. Big values in the
              gold — the accent that flags evidence throughout the site —
              with a plain-language phrase beside each. Direction-aware
              grid so the reader's eye sweeps in reading order. */}
          <dl className="mt-16 grid gap-x-10 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-y-0 lg:mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <dt className="text-[2.75rem] leading-none font-extrabold text-gold sm:text-[3.25rem]">
                  {stat.value}
                </dt>
                <dd className="max-w-[28ch] text-sm leading-snug text-white/70 sm:text-base">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* Ground plane — a single ascending riser motif that whispers the brand
          without an illustration on top of it. */}
      <div
        aria-hidden="true"
        className="riser-top -mt-px h-14 w-full bg-surface"
      />
    </section>
  );
}
