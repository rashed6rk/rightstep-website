import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * The official Right Step lockup — a horizontal SVG combining the D-shaped
 * stair mark on the left with the RIGHT STEP wordmark on the right. Used
 * everywhere in place of the previous mark + separate text, per the client's
 * request to have one consistent logo across every page.
 *
 * Two colours travel through the artwork:
 *   - Teal (#1596A0) draws the primary structure — stair treads and letters.
 *   - Navy (#12294B) draws the inner accent shapes on the mark.
 *
 * On dark surfaces the navy portions would vanish into the background, so
 * `onDark` swaps them to white — the same trick the earlier symbol used, only
 * applied to the full lockup this time. The mark deliberately does not mirror
 * under RTL: flipping the SVG would reverse the wordmark's letterforms.
 */

const NAVY = "#12294B";
const TEAL = "#1596A0";
/** Coral accent replaces navy on dark surfaces — a warmer, brand-owned swap
 * than white, and the only other palette colour with real contrast against a
 * near-black navy (7.06:1) while staying visually connected to the CTA hue
 * used elsewhere on the site. */
const CORAL = "#E8873A";

/** Aspect ratio of the artwork's content bounds — needed so callers can size
 * by height and let width follow, without having to remember the ratio. */
export const LOGO_ASPECT = 421 / 116;

export function LogoMark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const navy = onDark ? CORAL : NAVY;

  return (
    <svg
      viewBox="749 464 421 116"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* --- Navy accents on the mark ------------------------------------ */}
      <rect x="839" y="502.2" width="58.6" height="12.8" fill={navy} />
      <polygon
        points="839 517.4 839 530.2 897.6 530.2 897.6 514.9 839 517.4"
        fill={navy}
        fillRule="evenodd"
      />
      <polygon
        points="819.7 518.5 816.2 517.7 784.5 522.4 754.8 559.3 756.5 575.9 816.1 575.9 829.3 572.3 859.7 552.8 859.7 530.5 887.2 530.2 897.6 514.9 819.7 517.1 819.7 518.5"
        fill={navy}
        fillRule="evenodd"
      />

      {/* --- Teal wordmark: R I G H T | S T E P -------------------------- */}
      <path
        fill={TEAL}
        d="M915.5,504h13.2l6.3,11.7h14l-7.2-13.4c2.2-1.1,4-2.6,5.4-4.7,1.4-2.1,2.3-4.3,2.7-6.7.5-2.4.5-4.9,0-7.5-.4-2.5-1.3-4.9-2.6-6.9-1.3-2.1-3.1-3.8-5.3-5.1-2.2-1.3-4.9-2-7.9-2h-30.8v46.2h12.3v-11.7ZM915.5,480.7h17.4c1.1,0,2.1.3,2.9.9.8.6,1.3,1.4,1.7,2.3.4.9.6,1.9.6,3s-.2,2.1-.6,3c-.4.9-1,1.7-1.7,2.3-.8.6-1.7.9-2.8.9h-17.4v-12.3Z"
      />
      <polygon
        fill={TEAL}
        points="976.7 504.7 970.5 504.7 970.5 480.7 976.7 480.7 976.7 469.6 952 469.6 952 480.7 958.2 480.7 958.2 504.7 952 504.7 952 515.8 976.7 515.8 976.7 504.7"
      />
      <path
        fill={TEAL}
        d="M983.3,509c1.8,2.2,4,4,6.7,5.4,2.7,1.4,5.8,2,9.4,2h11c1.7,0,3.4-.3,5-.8,1.6-.5,3.2-1.1,4.6-1.7v1.8h11.1v-25.6h-24.6v11.1h9.2c-.2.6-.6,1.2-1.1,1.7-.5.5-1,.9-1.7,1.3-.6.3-1.3.6-1.9.8-.7.2-1.3.3-2,.3h-8.4c-2.3,0-4.2-.6-5.8-1.9-1.5-1.3-2.7-2.8-3.5-4.7-.8-1.9-1.2-3.9-1.2-6.1s.4-4.2,1.1-6.1c.8-1.9,1.9-3.4,3.4-4.7,1.5-1.3,3.5-1.9,5.8-1.9h8.4c3.1,0,5.5.6,7.2,1.9,1.7,1.3,2.6,3.2,2.6,5.8h12.3c0-3-.5-5.6-1.5-7.9-1-2.3-2.5-4.3-4.3-5.9-1.8-1.6-4-2.8-6.6-3.7-2.5-.8-5.3-1.3-8.4-1.3h-11c-3.6,0-6.7.7-9.4,2s-4.9,3.1-6.7,5.4c-1.8,2.2-3.1,4.8-4,7.6-.9,2.9-1.4,5.8-1.4,8.7s.4,5.9,1.3,8.7c.9,2.9,2.2,5.4,4,7.6Z"
      />
      <polygon
        fill={TEAL}
        points="1045.9 498.2 1105.7 498.2 1105.7 515.7 1118 515.7 1118 469.6 1105.7 469.6 1105.7 487.1 1045.9 487.1 1045.9 469.6 1033.6 469.6 1033.6 515.7 1045.9 515.7 1045.9 498.2"
      />
      <polygon
        fill={TEAL}
        points="1137.1 515.7 1149.4 515.7 1149.4 481.9 1166.1 481.9 1166.1 469.6 1120.5 469.6 1120.5 481.9 1137.1 481.9 1137.1 515.7"
      />
      <path
        fill={TEAL}
        d="M949.3,551.1c-1.2-1.4-2.7-2.5-4.5-3.3-1.8-.8-3.9-1.3-6.3-1.3h-18.2c-1.6,0-2.8-.4-3.6-1.3-.8-.8-1.2-1.8-1.2-2.8s.4-2,1.2-2.8c.8-.8,2-1.3,3.7-1.3h9.8c1.5,0,2.9,0,4.1,0,1.2,0,2.2.3,3,.6.8.3,1.5.8,1.9,1.5.5.7.7,1.7.7,3h12.3c0-3-.5-5.5-1.5-7.5-1-2.1-2.5-3.8-4.3-5-1.8-1.3-4-2.2-6.6-2.8-2.5-.6-5.3-.9-8.4-.9h-12.4c-3.4,0-6.3.7-8.7,2.2-2.3,1.5-4.1,3.4-5.3,5.6-1.2,2.2-1.8,4.7-1.9,7.3,0,2.6.5,5.1,1.7,7.3,1.1,2.2,2.9,4.1,5.3,5.6,2.4,1.5,5.3,2.2,9,2.2h17.7c1.4,0,2.4.4,3,1.1.6.7.8,1.6.7,2.5,0,.9-.4,1.7-1.1,2.5-.6.7-1.4,1.1-2.4,1.1h-11.3c-1.5,0-2.9,0-4.1-.2-1.2-.1-2.2-.3-3-.6-.8-.3-1.5-.8-1.9-1.4-.5-.6-.7-1.4-.7-2.4h-12.3c0,3,.5,5.4,1.5,7.5,1,2,2.5,3.6,4.3,4.8,1.8,1.2,4,2.1,6.6,2.6,2.5.5,5.3.8,8.4.8h13.9c2.4,0,4.5-.4,6.3-1.3,1.8-.8,3.3-1.9,4.5-3.3,1.2-1.4,2.1-2.9,2.7-4.7.6-1.7.9-3.5,1-5.4,0-1.8-.3-3.6-.8-5.4-.6-1.7-1.5-3.3-2.6-4.7Z"
      />
      <polygon
        fill={TEAL}
        points="954.7 540.9 971.3 540.9 971.3 574.8 983.6 574.8 983.6 540.9 1000.2 540.9 1000.2 528.6 954.7 528.6 954.7 540.9"
      />
      <polygon
        fill={TEAL}
        points="1002.7 574.8 1078.9 574.8 1078.9 563.7 1013.9 563.7 1013.9 557.2 1073.2 557.2 1073.2 546.1 1013.9 546.1 1013.9 539.7 1078.9 539.7 1078.9 528.6 1002.7 528.6 1002.7 574.8"
      />
      <path
        fill={TEAL}
        d="M1165.1,539.5c-.7-2.1-1.7-3.9-3-5.5-1.4-1.6-3-2.9-5-3.9-2-1-4.4-1.5-7.1-1.5h-69.2v46.2h12.3v-11.7h56.8c2.7,0,5.1-.5,7.1-1.5,2-1,3.7-2.3,5.1-3.9s2.4-3.5,3-5.5c.7-2.1,1-4.2,1-6.3s-.3-4.3-1-6.3ZM1153.3,548.8c-.4.9-1,1.7-1.7,2.3-.8.6-1.7.9-2.8.9h-55.7v-12.3h55.7c1.1,0,2.1.3,2.9.9.8.6,1.3,1.4,1.7,2.3.4.9.6,1.9.6,3s-.2,2.1-.6,3Z"
      />

      {/* --- The D-shaped stair mark on the left ------------------------- */}
      <path
        fill={TEAL}
        fillRule="evenodd"
        d="M858.5,545.4h-59.6v-10.6c0-1.2,1-2.2,2.2-2.2h57.4v12.8ZM837.3,560.6h-59.6v-10.6c0-1.2,1-2.2,2.2-2.2h57.4v12.8ZM872,531.7l15-1.5c-22.3,0-44.7,0-67,0v-10.6c0-1.2,1-2.2,2.2-2.2h48s27.4-2.4,27.4-2.4c-18.8,0-37.7,0-56.5,0v-10.6c0-1.2,1-2.2,2.2-2.2h28.6s0-33.2,0-33.2h-30.2c-48.3,0-87.9,39.5-87.9,87.9v19.1s2.7,0,2.7,0v-10.6c0-1.2,1-2.2,2.2-2.2h57.4v12.8s55.8,0,55.8,0v-44.2Z"
      />
    </svg>
  );
}

/**
 * The full lockup as a link home. The SVG already contains the RIGHT STEP
 * wordmark, so no separate translated text is rendered here — the same visual
 * shows on every page in both languages, matching the client's explicit
 * "same logo everywhere" instruction.
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  const t = useTranslations("meta");

  return (
    <Link
      href="/"
      className="group inline-flex items-center"
      aria-label={t("brand")}
    >
      <LogoMark
        className="h-8 w-auto transition-transform duration-300 ease-[var(--ease-step)] group-hover:-translate-y-0.5 sm:h-9"
        onDark={onDark}
      />
    </Link>
  );
}
