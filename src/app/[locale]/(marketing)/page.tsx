import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { ClientStrip } from "@/components/ClientStrip";
import { ServicesOverview } from "@/components/ServicesOverview";
import { StatsBand } from "@/components/StatsBand";
import { StepsStaircase } from "@/components/StepsStaircase";
import { CtaBand } from "@/components/CtaBand";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ClientStrip />
      <ServicesOverview />
      <StatsBand />
      <StepsStaircase />
      <CtaBand />
    </>
  );
}
