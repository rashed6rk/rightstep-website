"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import { deliverableKindIcon, deliverableKindTone } from "@/lib/portal";
import type { AdminClient, AdminResource } from "@/lib/admin";
import { Icon } from "../Icon";
import { HonestActionButton } from "./HonestActionButton";

/** Every file, for every client, filterable to one — the shared library an
 * owner would otherwise keep in Drive or Dropbox, with each file already
 * tied to the client it belongs to. */
export function ResourceLibraryExplorer({
  resources,
  clients,
}: {
  resources: AdminResource[];
  clients: AdminClient[];
}) {
  const t = useTranslations("admin.resourcesPage");
  const tDeliverables = useTranslations("portal.deliverables");
  const locale = useLocale();
  const [clientId, setClientId] = useState<string>("all");

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
  });

  const filtered = useMemo(
    () =>
      clientId === "all"
        ? resources
        : resources.filter((r) => String(r.clientId) === clientId),
    [resources, clientId],
  );

  const clientOf = (id: string | number) => clients.find((c) => String(c.id) === String(id));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            aria-label={t("filterClient")}
            className="w-full appearance-none rounded-xl border border-line bg-surface py-2.5 ps-4 pe-11 text-sm text-ink transition-colors focus:border-teal focus:outline-none"
          >
            <option value="all">{t("all")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
          <Icon
            name="chevron"
            className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-ink-faint"
          />
        </div>

        <HonestActionButton
          label={t("uploadCta")}
          icon="upload"
          noticeTitleKey="notConnectedTitle"
          noticeBodyKey="notConnectedBody"
          namespace="admin.resourcesPage"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-surface-alt p-8 text-center text-sm text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col">
          {filtered.map((item) => {
            const client = clientOf(item.clientId);
            return (
              <li key={item.id} className="border-t border-line first:border-t-0">
                <div className="flex flex-wrap items-center gap-3.5 py-3.5">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${deliverableKindTone[item.kind]}`}
                  >
                    <Icon name={deliverableKindIcon[item.kind]} className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-heading">
                      {tDeliverables(item.nameKey as "launchWorkbook")}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      {client?.company}
                      {" · "}
                      {tDeliverables("updated", {
                        date: dateFmt.format(new Date(item.updatedISO)),
                      })}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    <a
                      href="#"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-bold text-heading transition-colors hover:border-navy/40 sm:text-sm"
                    >
                      <Icon name="external" className="h-4 w-4" />
                      {t("view")}
                    </a>
                    <a
                      href="#"
                      download
                      aria-label={`${t("download")} — ${tDeliverables(item.nameKey as "launchWorkbook")}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-heading transition-colors hover:border-navy/40"
                    >
                      <Icon name="download" className="h-4 w-4" />
                    </a>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
