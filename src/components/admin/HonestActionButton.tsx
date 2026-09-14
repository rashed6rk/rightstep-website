"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "../Icon";
import { NotConnectedNotice } from "../AuthNotice";

/**
 * A single button whose click can only prove the UI is finished, not perform
 * the action — reused wherever the admin console needs one more write action
 * (new booking, upload a file) without repeating the working/blocked state
 * machine that every other form on this site already uses.
 */
export function HonestActionButton({
  label,
  icon,
  noticeTitleKey,
  noticeBodyKey,
  namespace,
}: {
  label: string;
  icon: IconName;
  noticeTitleKey: string;
  noticeBodyKey: string;
  namespace: string;
}) {
  const t = useTranslations(namespace);
  const [fired, setFired] = useState(false);

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => setFired(true)}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-coral px-4 text-sm font-bold text-navy transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:bg-coral-lift"
      >
        <Icon name={icon} className="h-4 w-4" />
        {label}
      </button>
      {fired && (
        <NotConnectedNotice
          title={t(noticeTitleKey as "notConnectedTitle")}
          body={t(noticeBodyKey as "notConnectedBody")}
        />
      )}
    </div>
  );
}
