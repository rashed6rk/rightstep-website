import { useLocale, useTranslations } from "next-intl";
import { InView } from "./Reveal";
import { Container, CtaButton } from "./ui";

type Step = { title: string; body: string; deliverable: string };

/**
 * Colour climbs with the staircase: teal (energy at the start) → gold
 * (achievement in the middle) → coral at the summit, which is also the CTA
 * colour, so the eye is pulled from Step One up to the button.
 *
 * Each chip pairs its fill with whichever label colour clears 4.5:1 on it —
 * white on the deep steps, navy on the bright ones.
 *
 * The risers also brighten as they rise: teal-800 at the bottom through to
 * full-strength coral at the summit. Explicit ramp steps rather than one hue
 * at falling opacity, so the climb is a real change in colour and every block
 * has a defined value instead of one that depends on what is behind it.
 */
/** Four rungs — one per step (Learn → Practice → Improve → Impact). The
 * previous version had five for the old consulting journey; collapsing the
 * two middle gold rungs into a single gold means the climb still moves
 * teal → gold → coral, but in four beats to match the new pedagogy. */
const rungs = [
  {
    dot: "bg-teal-700 text-white",
    block: "bg-teal-800",
    text: "text-teal-bright",
    ring: "ring-teal-500/20",
  },
  {
    dot: "bg-teal-600 text-white",
    block: "bg-teal-700",
    text: "text-teal-bright",
    ring: "ring-teal-500/25",
  },
  {
    dot: "bg-gold text-navy",
    block: "bg-gold-600",
    text: "text-gold-300",
    ring: "ring-gold-400/30",
  },
  {
    dot: "bg-coral text-navy",
    block: "bg-coral",
    text: "text-coral-300",
    ring: "ring-coral-400/35",
  },
];

export function StepsStaircase() {
  const t = useTranslations("steps");
  const locale = useLocale();
  const steps = t.raw("items") as Step[];
  const num = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <section
      id="steps"
      className="relative scroll-mt-28 overflow-hidden bg-navy-deep py-20 text-white sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tread-lines absolute inset-0 opacity-70" />
        <div className="absolute top-1/3 end-[-12%] h-[420px] w-[420px] rounded-full bg-teal/15 blur-[130px]" />
      </div>

      <Container className="relative">
        <div className="flex max-w-2xl flex-col gap-4">
          <h2 className="text-[2rem] leading-[1.08] font-bold text-balance sm:text-[2.6rem] md:text-[3.1rem]">
            {t("title")}
          </h2>
          <p className="max-w-[62ch] text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
            {t("body")}
          </p>
        </div>

        {/* ================= Mobile: vertical climb ================= */}
        <InView as="ol" className="stair mt-12 flex flex-col lg:hidden">
          {steps.map((step, i) => {
            const rung = rungs[i];
            const last = i === steps.length - 1;
            return (
              <li key={step.title}>
                <div
                  className="stair-card relative flex gap-4"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  {/* The rail runs the full height of the row, gap included,
                      so the climb reads as one continuous line. */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ring-4 ${rung.dot} ${rung.ring}`}
                    >
                      {num(i + 1)}
                    </span>
                    {!last && (
                      <span
                        aria-hidden="true"
                        className="mt-2 w-0.5 flex-1 rounded-full bg-navy-700"
                      />
                    )}
                  </div>

                  <div className="mb-8 flex-1 rounded-2xl border border-navy-800 bg-navy-900 p-5">
                    <h3 className="text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 on-dark-text text-sm text-white/75">
                      {step.body}
                    </p>
                    <div className="mt-4 border-t border-navy-800 pt-3">
                      <span className="block text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">
                        {t("deliverableLabel")}
                      </span>
                      <span
                        className={`mt-1 block text-sm font-semibold ${rung.text}`}
                      >
                        {step.deliverable}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </InView>

        {/* ================= Desktop: the actual staircase =================
            Each column sits on a riser that grows with the step index, so the
            cards physically ascend across the section. Direction-aware: under
            RTL the grid reverses and the stair climbs right-to-left. */}
        <InView
          as="ol"
          className="stair mt-16 hidden grid-cols-5 items-end gap-3 lg:grid"
        >
          {steps.map((step, i) => {
            const rung = rungs[i];
            return (
              <li key={step.title} className="flex h-full flex-col justify-end">
                <div
                  className="stair-card group rounded-2xl border border-navy-800 bg-navy-900 p-5 transition-colors duration-300 hover:border-navy-700 hover:bg-navy-800"
                  style={{ transitionDelay: `${140 + i * 110}ms` }}
                >
                  <span
                    className={`mb-4 grid h-11 w-11 place-items-center rounded-xl text-base font-bold ring-4 ${rung.dot} ${rung.ring}`}
                  >
                    {num(i + 1)}
                  </span>
                  <h3 className="text-lg font-bold text-white xl:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 on-dark-text text-sm text-white/75">
                    {step.body}
                  </p>
                  <div className="mt-4 border-t border-navy-800 pt-3">
                    <span className="block text-[10px] font-bold tracking-[0.14em] text-white/60 uppercase">
                      {t("deliverableLabel")}
                    </span>
                    <span
                      className={`mt-1.5 block text-sm font-semibold ${rung.text}`}
                    >
                      {step.deliverable}
                    </span>
                  </div>
                </div>

                {/* The riser: the block of stair this step stands on. */}
                <div
                  aria-hidden="true"
                  style={{
                    height: `${i * 44}px`,
                    transitionDelay: `${i * 110}ms`,
                  }}
                  className={`stair-riser mt-3 rounded-t-lg ${rung.block}`}
                />
              </li>
            );
          })}
        </InView>

        <div className="mt-12 flex justify-center lg:mt-14">
          <CtaButton href="/contact">{t("cta")}</CtaButton>
        </div>
      </Container>
    </section>
  );
}
