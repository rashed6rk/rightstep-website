"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";

export function PortalGreeting() {
  const t = useTranslations("portal");
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <h1 className="text-[1.75rem] leading-tight font-extrabold text-balance text-heading sm:text-[2.25rem]">
      {t(`greeting.${greetKey}` as "greeting.morning", { name: firstName })}
    </h1>
  );
}
