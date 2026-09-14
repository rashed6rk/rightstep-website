import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { ServiceKey } from "@/lib/site";
import { buildPortalData } from "@/lib/portal";
import { ProfileForm } from "@/components/portal/ProfileForm";

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

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileContent />;
}

function ProfileContent() {
  const t = useTranslations("portal.profile");
  const tServices = useTranslations("servicesOverview");
  const { client } = buildPortalData();
  const industries = tServices.raw("items") as {
    key: ServiceKey;
    title: string;
  }[];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-heading sm:text-[2.25rem]">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          {t("lead")}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <ProfileForm client={client} industries={industries} />
      </div>
    </div>
  );
}
