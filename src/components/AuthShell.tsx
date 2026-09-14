import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";
import { Container } from "./ui";

/**
 * Shared shell for sign-in and sign-up.
 *
 * A split layout: the form owns the reading column, and a navy panel carries
 * the reason to bother having an account. On mobile the panel drops below the
 * form entirely — someone who came here to sign in should not have to scroll
 * past a sales pitch to reach the fields.
 */
export function AuthShell({
  title,
  body,
  children,
  footer,
}: {
  title: string;
  body: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const t = useTranslations("auth");
  const points = t.raw("panelPoints") as string[];

  return (
    <section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          {/* --- The form column --- */}
          <div className="mx-auto flex w-full max-w-md min-w-0 flex-col lg:mx-0">
            <h1 className="text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-pretty text-ink-muted">
              {body}
            </p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 border-t border-line pt-5 text-sm text-ink-muted">
              {footer}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-ink-faint">
              {t("demoNotice")}
            </p>
          </div>

          {/* --- The reason to have an account ---
              Order is deliberate: last in the DOM so screen readers and mobile
              reach the form first, but pulled alongside it on wide screens. */}
          <aside className="relative overflow-hidden rounded-3xl bg-navy-deep p-7 text-white sm:p-10 lg:sticky lg:top-28">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="tread-lines absolute inset-0 opacity-70" />
              <div className="absolute -top-24 end-[-10%] h-72 w-72 rounded-full bg-teal/20 blur-[110px]" />
            </div>

            <div className="relative">
              <h2 className="text-[1.6rem] leading-[1.1] font-bold text-balance sm:text-[2rem]">
                {t("panelTitle")}
              </h2>
              <p className="on-dark-text mt-3 max-w-[44ch] text-sm text-white/75 sm:text-base">
                {t("panelBody")}
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {points.map((point, i) => (
                  <li key={point} className="flex items-start gap-3.5">
                    {/* Each point sits one rung higher than the last. */}
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                        ["bg-teal-700", "bg-gold-700", "bg-coral"][i]
                      } ${i === 2 ? "text-navy" : "text-white"}`}
                    >
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <span className="on-dark-text text-sm text-white/85">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
