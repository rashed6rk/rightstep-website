"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { formatCount, numberLocale } from "@/lib/format";
import { stepKeys, type Turn } from "@/lib/portal";
import type { AdminClient, ClientStatus } from "@/lib/admin";
import { Icon } from "../Icon";
import { AddClientForm } from "./AddClientForm";

const turnTone: Record<Turn, string> = {
  client: "bg-coral text-navy",
  firm: "bg-teal-700 text-white",
  clear: "bg-ink-100 text-ink-700",
};

/**
 * The client roster — search, filter, and one row per client that opens
 * their full record. Rendered as cards rather than a `<table>` so the same
 * markup reads cleanly from 320px up, matching how the rest of the site
 * handles list data (the workshop schedule uses the same pattern).
 */
export function ClientsExplorer({
  clients,
  industries,
  stepTitles,
  openAddForm,
  initialQuery,
}: {
  clients: AdminClient[];
  industries: { key: string; title: string }[];
  stepTitles: string[];
  openAddForm: boolean;
  initialQuery: string;
}) {
  const t = useTranslations("admin.clientsPage");
  const tTurn = useTranslations("portal.turn");
  const locale = useLocale();

  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<ClientStatus | "all">("all");
  const [formOpen, setFormOpen] = useState(openAddForm);

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.company.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [clients, query, status]);

  const active = status !== "all" || query.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Icon
            name="search"
            className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4.5 w-4.5 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-line bg-surface py-2.5 ps-11 pe-4 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label={t("filterStatus")} className="flex gap-2">
            {(
              [
                ["all", t("all")],
                ["active", t("statusActive")],
                ["paused", t("statusPaused")],
                ["completed", t("statusCompleted")],
              ] as [ClientStatus | "all", string][]
            ).map(([value, label]) => {
              const isActive = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-9 items-center rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-navy bg-navy text-white"
                      : "border-line text-ink-muted hover:border-line-strong hover:text-heading"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-coral px-3.5 text-sm font-bold text-navy transition-colors hover:bg-coral-lift"
          >
            <Icon name="plus" className="h-4 w-4" />
            {t("addClientCta")}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p aria-live="polite" className="text-sm font-semibold text-ink-muted">
          {filtered.length === 1
            ? t("resultsOne")
            : t("resultsOther", { count: formatCount(filtered.length, locale) })}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="inline-flex min-h-8 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
          >
            <Icon name="close" className="h-4 w-4" />
            {t("clear")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-surface-alt p-8 text-center text-sm text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="flex flex-col">
          {filtered.map((client) => (
            <li key={client.id} className="border-t border-line first:border-t-0">
              <Link
                href={`/admin/clients/${client.id}`}
                className="group grid gap-3 py-4 transition-colors hover:bg-navy/[0.02] sm:grid-cols-[1.6fr_1fr_1fr_0.9fr] sm:items-center sm:gap-4 sm:px-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-xs font-bold text-white">
                    {client.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-heading">
                      {client.company}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {client.name}
                    </span>
                  </span>
                </span>

                <span className="flex items-center gap-2 text-sm text-ink">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-800">
                    {stepTitles[stepKeys.indexOf(client.stepKey)]}
                  </span>
                </span>

                <span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${turnTone[client.turn]}`}
                  >
                    {tTurn(`${client.turn}Tag` as "clientTag")}
                  </span>
                </span>

                <span className="flex items-center justify-between gap-2 text-sm text-ink-muted sm:justify-end">
                  <span className="tabular-nums">
                    {client.nextSessionISO
                      ? dateFmt.format(new Date(client.nextSessionISO))
                      : t("noSession")}
                  </span>
                  <Icon
                    name="arrow"
                    flipRtl
                    className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <AddClientForm
          industries={industries}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
