"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "../Icon";
import { NotConnectedNotice } from "../AuthNotice";

/**
 * Every owner-side action on a client record — upload, schedule, message,
 * advance the step — funnels through the same honest state as the rest of
 * the site: a real button, a brief "working" moment, then an explicit notice
 * about what isn't wired up yet. One shared component so all four actions
 * behave identically instead of four different half-implementations.
 */
export function ClientDetailActions() {
  const t = useTranslations("admin.clientDetail");
  const [fired, setFired] = useState<string | null>(null);

  const actions: { key: string; icon: IconName; primary?: boolean }[] = [
    { key: "scheduleCta", icon: "calendar", primary: true },
    { key: "uploadCta", icon: "upload" },
    { key: "messageCta", icon: "message" },
    { key: "advanceStepCta", icon: "check" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2.5">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => setFired(action.key)}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3.5 text-sm font-bold transition-colors ${
              action.primary
                ? "bg-coral text-navy hover:bg-coral-lift"
                : "border border-line text-heading hover:border-navy/40"
            }`}
          >
            <Icon name={action.icon} className="h-4 w-4" />
            {t(action.key as "scheduleCta")}
          </button>
        ))}
      </div>

      {fired && (
        <NotConnectedNotice
          title={t("notConnectedTitle")}
          body={t("notConnectedBody")}
        />
      )}
    </div>
  );
}
