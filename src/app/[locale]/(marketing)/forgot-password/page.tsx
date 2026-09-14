import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AuthShell } from "@/components/AuthShell";
import { ForgotForm } from "@/components/ForgotForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.forgot" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForgotPageContent />;
}

function ForgotPageContent() {
  const t = useTranslations("forgot");

  return (
    <AuthShell
      title={t("title")}
      body={t("body")}
      footer={
        <Link
          href="/login"
          className="font-bold text-heading underline underline-offset-4 transition-colors hover:text-coral-ink"
        >
          {t("backToLogin")}
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
