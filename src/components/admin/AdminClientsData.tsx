"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { ServiceKey } from "@/lib/site";
import { getAdminClients } from "@/lib/api";
import type { AdminClient } from "@/lib/admin";
import { ClientsExplorer } from "./ClientsExplorer";
import { OverviewSkeleton } from "@/components/portal/Skeleton";

export function AdminClientsData() {
  const t = useTranslations("admin.clientsPage");
  const tServices = useTranslations("servicesOverview");
  const tSteps = useTranslations("steps");
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminClients()
      .then((data) => {
        setClients(data.clients as unknown as AdminClient[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const industries = tServices.raw("items") as {
    key: ServiceKey;
    title: string;
  }[];
  const stepTitles = (tSteps.raw("items") as { title: string }[]).map(
    (s) => s.title,
  );

  if (loading) return <OverviewSkeleton />;

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
