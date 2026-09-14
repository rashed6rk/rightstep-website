import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { Container, CtaButton } from "./ui";

export function CtaBand() {
  const t = useTranslations("ctaBand");

  return (
    <section className="bg-surface pb-20 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="tread-lines absolute inset-0 opacity-60" />
            <div className="absolute -bottom-24 end-[-6%] h-72 w-72 rounded-full bg-coral/20 blur-[100px]" />
          </div>

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[1.75rem] leading-[1.08] font-bold text-balance sm:text-[2.15rem] md:text-[2.5rem]">
                {t("title")}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-pretty text-white/70">
                {t("body")}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:shrink-0">
              <CtaButton href="/contact">{t("primary")}</CtaButton>
              <a
                href={`tel:${site.phone}`}
                className="py-1.5 text-center text-sm font-semibold text-white/70 transition-colors hover:text-white"
              >
                {t("secondary")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
