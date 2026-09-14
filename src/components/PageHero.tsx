import { Container } from "./ui";

/**
 * Shared hero for inner pages. Compact sibling of the homepage hero — the
 * heading carries the page on its own, with no label stacked above it.
 */
export function PageHero({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pt-[72px] text-white sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tread-lines absolute inset-0 opacity-60" />
        <div className="absolute -top-24 end-[-8%] h-80 w-80 rounded-full bg-teal/20 blur-[110px]" />
      </div>

      <Container className="relative">
        <div className="flex max-w-3xl flex-col gap-6 py-16 sm:py-24">
          <h1 className="text-[2.25rem] leading-[1.02] font-extrabold text-balance sm:text-[3rem] lg:text-[3.75rem]">
            {title}
          </h1>
          <p className="max-w-[60ch] text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
            {body}
          </p>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="riser-top -mt-px h-14 w-full bg-surface"
      />
    </section>
  );
}
