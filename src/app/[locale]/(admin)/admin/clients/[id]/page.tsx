import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminClientDetailData } from "@/components/admin/AdminClientDetailData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.admin" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ClientDetailShell paramId={id} />;
}

function ClientDetailShell({ paramId }: { paramId: string }) {
  return <AdminClientDetailData clientId={paramId} />;
}
