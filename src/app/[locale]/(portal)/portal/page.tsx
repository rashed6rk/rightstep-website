import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortalOverviewData } from "@/components/portal/PortalOverviewData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.portal" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function PortalOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortalOverviewData />;
}
