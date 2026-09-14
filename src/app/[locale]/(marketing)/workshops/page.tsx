import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { WorkshopsHub } from "@/components/WorkshopsHub";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.workshops" });
  return { title: t("title"), description: t("description") };
}

export default async function WorkshopsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "workshopsPage" });
  const tw = await getTranslations({ locale, namespace: "workshops" });

  return (
    <>
      <PageHero title={t("title")} body={t("lead")} />
      {/* Data is read on the server and handed down, so the client component
          only owns the filter state. */}
      <WorkshopsHub items={tw.raw("items")} />
      <CtaBand />
    </>
  );
}
