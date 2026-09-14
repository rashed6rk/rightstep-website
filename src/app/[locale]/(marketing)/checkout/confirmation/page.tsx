import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConfirmationClient } from "@/components/ConfirmationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.confirmation" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-static";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "confirmation" });
  const next = t.raw("next") as string[];

  return (
    <ConfirmationClient
      locale={locale}
      translations={{
        title: t("title"),
        body: t("body", { email: "{email}" }),
        reference: t("reference"),
        nextTitle: t("nextTitle"),
        next,
        portalCta: t("portalCta"),
        scheduleCta: t("scheduleCta"),
        demoNotice: t("demoNotice"),
      }}
    />
  );
}
