import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Turn } from "@/lib/portal";
import { Icon, type IconName } from "../Icon";

/**
 * The single most useful fact a consulting client can be shown: whose court
 * the ball is in.
 *
 * Most portals open on a row of counters. A counter never tells you whether
 * you are the one holding the project up — which is the actual source of
 * client anxiety, and the thing that generates "any update?" emails. So this
 * card leads, states the owner in plain words, names one action, and gives it
 * a deadline.
 *
 * Colour does the signalling but never carries it alone: each state also has
 * its own wording and icon, so it survives greyscale and colour blindness.
 */
const states: Record<
  Turn,
  {
    tag: string;
    icon: IconName;
    /** Coral is the action colour, so it is spent only when the client must act. */
    surface: string;
    chip: string;
    accent: string;
  }
> = {
  client: {
    tag: "clientTag",
    icon: "upload",
    surface: "border-coral-200 bg-coral-50",
    chip: "bg-coral text-navy",
    accent: "text-coral-ink",
  },
  firm: {
    tag: "firmTag",
    icon: "clock",
    surface: "border-teal-200 bg-teal-50",
    chip: "bg-teal-700 text-white",
    accent: "text-teal-ink",
  },
  clear: {
    tag: "clearTag",
    icon: "check",
    surface: "border-line bg-surface",
    chip: "bg-ink-100 text-ink-700",
    accent: "text-ink-muted",
  },
};

export function TurnCard({ turn, dueLabel }: { turn: Turn; dueLabel: string }) {
  const t = useTranslations("portal.turn");
  const state = states[turn];

  const title = t(`${turn}Title` as "clientTitle");
  const body = t(`${turn}Body` as "clientBody");
  const action = t(`${turn}Action` as "clientAction");
  const href =
    turn === "client"
      ? "/portal/resources"
      : turn === "firm"
        ? "/portal"
        : "/portal/bookings";

  return (
    <section
      aria-labelledby="turn-heading"
      className={`rounded-2xl border p-6 sm:p-8 ${state.surface}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${state.chip}`}
        >
          <Icon name={state.icon} className="h-4 w-4" />
          {t(state.tag as "clientTag")}
        </span>
        {turn !== "clear" && (
          <span className={`text-sm font-semibold ${state.accent}`}>
            {dueLabel}
          </span>
        )}
      </div>

      <h2
        id="turn-heading"
        className="mt-5 max-w-[24ch] text-[1.5rem] leading-[1.15] font-bold text-balance text-heading sm:text-[1.9rem]"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-pretty text-ink sm:text-base">
        {body}
      </p>

      <Link
        href={href}
        className={`group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 sm:text-base ${
          turn === "client"
            ? "bg-coral text-navy shadow-[var(--shadow-cta)] hover:bg-coral-lift"
            : "border border-navy/20 text-navy hover:border-navy/50 hover:bg-navy/[0.04]"
        }`}
      >
        {action}
        <Icon
          name="arrow"
          flipRtl
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </section>
  );
}
