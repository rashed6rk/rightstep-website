import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/SignupForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.signup" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignupPageContent />;
}

function SignupPageContent() {
  const t = useTranslations("signup");

  return (
    <AuthShell
      title={t("title")}
      body={t("body")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="inline-block py-1 font-bold text-heading underline underline-offset-4 transition-colors hover:text-coral-ink"
          >
            {t("loginLink")}
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
