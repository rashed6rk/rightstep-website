import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { buildPortalData, deliverableCategory } from "@/lib/portal";
import { ResourceCategorySection } from "@/components/portal/ResourceCategorySection";

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

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResourcesContent />;
}

const CATEGORIES = ["strategy", "marketing", "presentations"] as const;

function ResourcesContent() {
  const t = useTranslations("portal.resources");
  const { deliverables } = buildPortalData();

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

      <div className="mt-6 flex flex-col gap-5 sm:mt-8">
        {CATEGORIES.map((category) => (
          <ResourceCategorySection
            key={category}
            category={category}
            items={deliverables.filter(
              (item) => deliverableCategory(item.kind) === category,
            )}
          />
        ))}
      </div>
    </div>
  );
}
