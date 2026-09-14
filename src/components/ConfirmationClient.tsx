"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Link } from "@/i18n/routing";
import { Icon } from "@/components/Icon";
import { Container, CtaButton } from "@/components/ui";

type Props = {
  locale: string;
  translations: {
    title: string;
    body: string;
    reference: string;
    nextTitle: string;
    next: string[];
    portalCta: string;
    scheduleCta: string;
    demoNotice: string;
  };
};

function ConfirmationInner({ locale, translations: t }: Props) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "RS-2026-0000";
  const email = searchParams.get("email") ?? "your inbox";

  return (
    <section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-start py-16 sm:py-24">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-700 text-white">
            <Icon name="check" className="h-7 w-7" />
          </span>

          <h1 className="mt-7 text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.75rem]">
            {t.title}
          </h1>

          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
            {t.body.replace("{email}", email)}
          </p>

          <p className="mt-6 flex items-center gap-2.5 rounded-xl bg-surface-alt px-4 py-3 text-sm">
            <span className="font-bold text-ink-faint">{t.reference}</span>
            <span dir="ltr" className="font-bold tabular-nums text-heading">
              {ref}
            </span>
          </p>

          <div className="mt-10 w-full border-t border-line pt-8">
            <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
              {t.nextTitle}
            </h2>
            <ol className="mt-4 flex flex-col">
              {t.next.map((line, i) => (
                <li key={line} className="flex gap-4 border-b border-line py-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-xs font-bold text-heading">
                    {new Intl.NumberFormat(
                      locale === "ar" ? "ar-u-nu-arab" : "en",
                    ).format(i + 1)}
                  </span>
                  <span className="text-sm leading-relaxed text-pretty text-ink sm:text-base">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CtaButton href="/portal">{t.portalCta}</CtaButton>
            <Link
              href="/workshops"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-navy/20 px-6 py-3.5 text-sm font-bold text-heading transition-colors hover:border-navy/50 hover:bg-navy/[0.04] sm:text-base"
            >
              {t.scheduleCta}
            </Link>
          </div>

          <p className="mt-8 text-xs text-ink-faint">{t.demoNotice}</p>
        </div>
      </Container>
    </section>
  );
}

export function ConfirmationClient(props: Props) {
  return (
    <Suspense>
      <ConfirmationInner {...props} />
    </Suspense>
  );
}
