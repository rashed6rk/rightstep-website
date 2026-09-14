import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ServiceKey } from "@/lib/site";
import type { Workshop } from "@/components/CheckoutClient";
import { CheckoutWrapper } from "@/components/CheckoutWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.checkout" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tWorkshops = await getTranslations({ locale, namespace: "workshops" });
  const tServices = await getTranslations({
    locale,
    namespace: "servicesOverview",
  });
  const t = await getTranslations({ locale, namespace: "checkout" });

  const workshops = tWorkshops.raw("items") as Workshop[];
  const services = tServices.raw("items") as {
    key: ServiceKey;
    title: string;
  }[];

  return (
    <CheckoutWrapper
      workshops={workshops}
      services={services}
      emptyState={{
        title: t("emptyTitle"),
        body: t("emptyBody"),
        cta: t("emptyCta"),
      }}
    />
  );
}

export const dynamic = "force-static";
