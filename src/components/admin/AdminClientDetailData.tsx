"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale, formatAmount } from "@/lib/format";
import { stepKeys, deliverableKindIcon, deliverableKindTone } from "@/lib/portal";
import { getAdminClient } from "@/lib/api";
import type { AdminClient, AdminBooking, AdminResource } from "@/lib/admin";
import { Icon, ServiceIcon } from "@/components/Icon";
import { ClientDetailActions } from "./ClientDetailActions";

export function AdminClientDetailData({ clientId }: { clientId: string }) {
  const t = useTranslations("admin.clientDetail");
  const tSteps = useTranslations("steps");
  const tDeliverables = useTranslations("portal.deliverables");
  const tBookings = useTranslations("portal.bookings");
  const tWorkshops = useTranslations("workshops");
  const tServices = useTranslations("servicesOverview");
  const locale = useLocale();

  const [client, setClient] = useState<AdminClient | null>(null);
  const [sessions, setSessions] = useState<AdminBooking[]>([]);
  const [files, setFiles] = useState<AdminResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let rawId = clientId;
    if (rawId === "_" && typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      rawId = segments[segments.length - 1] || "_";
    }
    const id = parseInt(rawId, 10);
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }
    getAdminClient(id)
      .then((data) => {
        setClient(data.client as unknown as AdminClient);
        setSessions(data.sessions as unknown as AdminBooking[]);
        setFiles(data.resources as unknown as AdminResource[]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [clientId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="h-6 w-32 animate-pulse rounded bg-ink-100" />
        <div className="mt-5 flex items-start gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-ink-100" />
          <div className="flex-1">
            <div className="h-7 w-48 animate-pulse rounded bg-ink-100" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-heading"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180 rtl:rotate-0" />
          {t("backLink")}
        </Link>
        <p className="mt-8 text-center text-ink-muted">{t("notFound")}</p>
      </div>
    );
  }

  const steps = tSteps.raw("items") as { title: string }[];
  const industryName =
    (tServices.raw("items") as { key: string; title: string }[]).find(
      (s) => s.key === client.industry,
    )?.title ?? "";
  const currentIndex = stepKeys.indexOf(client.stepKey);

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const sessionDateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href="/admin/clients"
        className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-semibold text-ink-muted transition-colors hover:text-heading"
      >
        <Icon
          name="arrow"
          className="h-4 w-4 rotate-180 transition-transform group-hover/link:-translate-x-0.5 rtl:rotate-0"
        />
        {t("backLink")}
      </Link>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy text-lg font-bold text-white">
            {client.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-heading sm:text-2xl">
                {client.company}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-ink">
                <ServiceIcon service={client.industry} className="h-3.5 w-3.5" />
                {industryName}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                  client.status === "active"
                    ? "bg-teal-50 text-teal-ink"
                    : client.status === "paused"
                      ? "bg-gold-50 text-gold-ink"
                      : "bg-ink-100 text-ink-700"
                }`}
              >
                {t(`status${client.status[0].toUpperCase()}${client.status.slice(1)}` as "statusActive")}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{client.name}</p>
            <p className="mt-0.5 text-xs text-ink-faint">
              {t("memberSince", { date: dateFmt.format(new Date(client.joinedISO)) })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ClientDetailActions />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
            {t("contactTitle")}
          </h2>
          <dl className="mt-3 flex flex-col gap-2.5 text-sm">
            <div className="flex items-center gap-2.5">
              <Icon name="mail" className="h-4 w-4 text-ink-faint" />
              <a href={`mailto:${client.email}`} dir="ltr" className="text-ink hover:text-heading">
                {client.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Icon name="phone" className="h-4 w-4 text-ink-faint" />
              <a href={`tel:${client.phone}`} dir="ltr" className="text-ink hover:text-heading">
                {client.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 border-t border-line pt-2.5">
              <Icon name="revenue" className="h-4 w-4 text-ink-faint" />
              <span className="tabular-nums text-ink">
                {formatAmount(client.monthlyFeeAed, locale)}{" "}
                <span className="text-xs font-semibold text-ink-muted">
                  {tWorkshops("currency")}
                </span>
              </span>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
            {t("journeyTitle")}
          </h2>
          <ol className="mt-3 flex flex-col">
            {stepKeys.map((key, i) => {
              const done = i < currentIndex;
              const current = i === currentIndex;
              return (
                <li key={key} className="flex items-center gap-3 py-1.5">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      done
                        ? "bg-teal-600 text-white"
                        : current
                          ? "bg-coral text-navy"
                          : "bg-ink-100 text-ink-700"
                    }`}
                  >
                    {done ? <Icon name="check" className="h-3 w-3" /> : i + 1}
                  </span>
                  <span
                    className={`text-sm ${current ? "font-bold text-heading" : done ? "text-ink" : "text-ink-faint"}`}
                  >
                    {steps[i]?.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
            {t("sessionsTitle")}
          </h2>
          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">{t("noSessions")}</p>
          ) : (
            <ul className="mt-3 flex flex-col">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                  <span className="text-sm text-ink">
                    {sessionDateFmt.format(new Date(s.startISO))}
                  </span>
                  {s.meetUrl && (
                    <a
                      href={s.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-bold text-heading transition-colors hover:border-navy/40"
                    >
                      <Icon name="video" className="h-3.5 w-3.5" />
                      {tBookings("join")}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase">
            {t("resourcesTitle")}
          </h2>
          {files.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">{t("noResources")}</p>
          ) : (
            <ul className="mt-3 flex flex-col">
              {files.map((f) => (
                <li key={f.id} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${deliverableKindTone[f.kind]}`}
                  >
                    <Icon name={deliverableKindIcon[f.kind]} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-heading">
                    {tDeliverables(f.nameKey as "launchWorkbook")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
