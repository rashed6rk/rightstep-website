import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { Container } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageContent />;
}

function ContactPageContent() {
  const t = useTranslations("contactPage");

  // Icon names only — the glyphs come from the one 24-grid set, so these
  // rows can never drift onto a different stroke or grid again.
  const details = [
    {
      label: t("direct.phoneLabel"),
      value: site.phoneDisplay,
      href: `tel:${site.phone}`,
      ltr: true,
      accent: "bg-teal-50 text-teal-ink",
      icon: "phone" as const,
    },
    {
      label: t("direct.emailLabel"),
      value: site.email,
      href: `mailto:${site.email}`,
      ltr: true,
      accent: "bg-gold-50 text-gold-ink",
      icon: "mail" as const,
    },
    {
      label: t("direct.locationLabel"),
      value: t("direct.locationValue"),
      href: null,
      ltr: false,
      accent: "bg-navy-50 text-navy-800",
      icon: "pin" as const,
    },
    ...(t("direct.hoursLabel") ? [{
      label: t("direct.hoursLabel"),
      value: t("direct.hoursValue"),
      href: null,
      ltr: false,
      accent: "bg-teal-50 text-teal-ink",
      icon: "clock" as const,
    }] : []),
  ];

  return (
    <section className="bg-surface pt-[72px] sm:pt-20">
      <Container>
        <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-20">
          {/* --- Left: context + direct channels ---
              min-w-0: grid children default to min-width:auto, which stops the
              truncating email row from shrinking and blows the page out
              horizontally on 320px screens. */}
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h1 className="text-[2.25rem] leading-[1.02] font-extrabold text-balance text-heading sm:text-[2.75rem] lg:text-[3.25rem]">
                {t("title")}
              </h1>
              <p className="max-w-[52ch] text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
                {t("body")}
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-bold tracking-[0.14em] text-ink-faint uppercase">
                {t("direct.title")}
              </h2>
              <ul className="flex flex-col gap-3">
                {details.map((detail) => {
                  const content = (
                    <>
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${detail.accent}`}
                      >
                        <Icon name={detail.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-ink-faint">
                          {detail.label}
                        </span>
                        <span
                          dir={detail.ltr ? "ltr" : undefined}
                          className="mt-0.5 block truncate text-sm font-bold text-heading rtl:text-start"
                        >
                          {detail.value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={detail.label}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:border-teal/50 hover:shadow-[var(--shadow-step)]"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* A quiet reminder of the staircase at the bottom of the column */}
            <div aria-hidden="true" className="mt-auto flex items-end gap-1.5">
              <span className="h-3 w-8 rounded-t bg-teal/30" />
              <span className="h-5 w-8 rounded-t bg-gold/40" />
              <span className="h-8 w-8 rounded-t bg-coral/60" />
            </div>
          </div>

          {/* --- Right: the form --- */}
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
