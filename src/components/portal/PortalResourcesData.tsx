"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getPortalResources, type PortalResources } from "@/lib/api";
import { deliverableCategory } from "@/lib/portal";
import { ResourceCategorySection } from "./ResourceCategorySection";
import { OverviewSkeleton } from "./Skeleton";

const CATEGORIES = ["strategy", "marketing", "presentations"] as const;

export function PortalResourcesData() {
  const t = useTranslations("portal.resources");
  const [data, setData] = useState<PortalResources | null>(null);

  useEffect(() => {
    getPortalResources().then(setData).catch(() => {});
  }, []);

  if (!data) return <OverviewSkeleton />;

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
            items={data.deliverables.filter(
              (item) => deliverableCategory(item.kind) === category,
            )}
          />
        ))}
      </div>
    </div>
  );
}
