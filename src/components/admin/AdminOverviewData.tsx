"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";
import { getAdminStats, getAdminClients, getAdminSessions, type AdminStats } from "@/lib/api";
import type { AdminClient, AdminBooking } from "@/lib/admin";
import { StatsRow } from "./StatsRow";
import { AttentionList } from "./AttentionList";
import { UpcomingBookingsList } from "./UpcomingBookingsList";
import { Icon, type IconName } from "@/components/Icon";

export function AdminOverviewData() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getAdminClients(),
      getAdminSessions(),
    ])
      .then(([s, c, b]) => {
        setStats(s);
        setClients(c.clients as unknown as AdminClient[]);
        setBookings(b.sessions as unknown as AdminBooking[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-ink-100" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded bg-ink-100" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      </div>
    );
  }

  const ownerName = user?.name ?? "";
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const waitingClients = clients.filter(
    (c) => c.status === "active" && c.turn === "client",
  );
  const clientName = (id: string | number) =>
    clients.find((c) => String(c.id) === String(id))?.company ?? "";

  const quickActions: { key: string; icon: IconName; href: string }[] = [
    { key: "addClient", icon: "clients", href: "/admin/clients?new=1" },
    { key: "newBooking", icon: "calendar", href: "/admin/bookings" },
    { key: "uploadResource", icon: "upload", href: "/admin/resources" },
    { key: "viewAll", icon: "external", href: "/admin/clients" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[1.75rem] leading-tight font-extrabold text-balance text-heading sm:text-[2.25rem]">
          {t(`greeting.${greetKey}` as "greeting.morning", { name: ownerName })}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          {t("greeting.sub")}
        </p>
      </header>

      <div className="mt-6 sm:mt-8">
        <StatsRow stats={stats} />
      </div>

      <div className="mt-5 sm:mt-6">
        <AttentionList clients={waitingClients} />
      </div>

      <div className="mt-5 sm:mt-6">
        <UpcomingBookingsList bookings={bookings} clientName={clientName} />
      </div>

      <section aria-labelledby="qa-heading" className="mt-5 sm:mt-6">
        <h2
          id="qa-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("quickActions.title")}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <li key={action.key}>
              <Link
                href={action.href}
                className="flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-line bg-surface p-4 transition-all duration-300 ease-[var(--ease-step)] hover:-translate-y-0.5 hover:border-line-strong"
              >
                <Icon name={action.icon} className="h-5 w-5 text-teal-ink" />
                <span className="text-sm font-bold text-heading">
                  {t(`quickActions.${action.key}` as "quickActions.addClient")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
