"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getAdminResources, getAdminClients } from "@/lib/api";
import type { AdminClient, AdminResource } from "@/lib/admin";
import { ResourceLibraryExplorer } from "./ResourceLibraryExplorer";
import { OverviewSkeleton } from "@/components/portal/Skeleton";

export function AdminResourcesData() {
  const t = useTranslations("admin.resourcesPage");
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminResources(), getAdminClients()])
      .then(([r, c]) => {
        setResources(r.resources as unknown as AdminResource[]);
        setClients(c.clients as unknown as AdminClient[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <OverviewSkeleton />;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-heading sm:text-[2.25rem]">
          {t("title")}
        </h1>
        <p className="mt-1.5 max-w-[58ch] text-sm text-ink-muted sm:text-base">
          {t("lead")}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <ResourceLibraryExplorer resources={resources} clients={clients} />
      </div>
    </div>
  );
}
