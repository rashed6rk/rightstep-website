import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.login" });
  return {
    title: t("title"),
    description: t("description"),
    // Account screens have nothing to offer a search engine and shouldn't
    // compete with the marketing pages.
    robots: { index: false, follow: true },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginPageContent />;
}

function LoginPageContent() {
  const t = useTranslations("login");

  return (
    <AuthShell
      title={t("title")}
      body={t("body")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="inline-block py-1 font-bold text-heading underline underline-offset-4 transition-colors hover:text-coral-ink"
          >
            {t("signupLink")}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
