import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { ServiceKey } from "@/lib/site";
import { buildAdminData } from "@/lib/admin";
import { ClientsExplorer } from "@/components/admin/ClientsExplorer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.admin" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientsContent />;
}

function ClientsContent() {
  const t = useTranslations("admin.clientsPage");
  const tServices = useTranslations("servicesOverview");
  const tSteps = useTranslations("steps");
  const { clients } = buildAdminData();

  const industries = tServices.raw("items") as {
    key: ServiceKey;
    title: string;
  }[];
  const stepTitles = (tSteps.raw("items") as { title: string }[]).map(
    (s) => s.title,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-heading sm:text-[2.25rem]">
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-[58ch] text-sm text-ink-muted sm:text-base">
          {t("lead")}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <ClientsExplorer
          clients={clients}
          industries={industries}
          stepTitles={stepTitles}
          openAddForm={false}
          initialQuery=""
        />
      </div>
    </div>
  );
}

export const dynamic = "force-static";
