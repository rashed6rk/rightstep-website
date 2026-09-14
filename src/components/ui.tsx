import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { Icon } from "./Icon";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section headings carry themselves. There is deliberately no kicker/eyebrow
 * label above them — that stacked "LABEL / Heading / paragraph" unit is the
 * single loudest tell of a templated page, and every section here reads fine
 * without it.
 */
export function SectionHeading({
  title,
  body,
  onDark = false,
  align = "start",
}: {
  title: ReactNode;
  body?: string;
  onDark?: boolean;
  align?: "start" | "center";
}) {
  return (
    <div
      className={`flex max-w-2xl flex-col gap-4 ${
        align === "center" ? "mx-auto items-center text-center" : ""
      }`}
    >
      <h2
        className={`text-[2rem] leading-[1.08] font-bold text-balance sm:text-[2.6rem] md:text-[3.1rem] ${
          onDark ? "text-white" : "text-heading"
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`max-w-[62ch] text-base leading-relaxed text-pretty sm:text-lg ${
            onDark ? "text-white/70" : "text-ink-muted"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

/**
 * The ONLY place coral is allowed: primary calls to action.
 *
 * The label is navy, not white — white on #E8873A is 2.6:1 and fails AA at
 * button sizes. Navy on coral is 5.5:1, keeps the brand colour exactly as
 * specified, and reads sharper than the usual white-on-orange besides.
 */
export function CtaButton({
  href,
  children,
  className = "",
  external = false,
}: CtaProps) {
  const cls = `group inline-flex items-center justify-center gap-2 rounded-xl bg-coral px-6 py-3.5 text-sm font-bold text-navy shadow-[var(--shadow-cta)] transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift active:translate-y-0 sm:text-base ${className}`;

  const inner = (
    <>
      {children}
      <ArrowIcon />
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  onDark = false,
  className = "",
}: CtaProps & { onDark?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-300 sm:text-base ${
        onDark
          ? "border-white/25 text-white hover:border-white/60 hover:bg-white/5"
          : "border-navy/20 text-heading hover:border-navy/50 hover:bg-navy/[0.04]"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Both of these now come off the single 24-grid set in Icon.tsx — they are kept
 * as named wrappers because they carry layout behaviour the raw glyph doesn't:
 * the arrow travels on hover and mirrors under RTL.
 */
export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <Icon
      name="arrow"
      flipRtl
      className={`h-4 w-4 transition-transform duration-300 ease-[var(--ease-step)] group-hover:translate-x-0.5 ${className}`}
    />
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return <Icon name="check" className={`h-4 w-4 ${className}`} />;
}
