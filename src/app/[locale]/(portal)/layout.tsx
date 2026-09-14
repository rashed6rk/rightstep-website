import { setRequestLocale } from "next-intl/server";
import { buildPortalData } from "@/lib/portal";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { PortalTabs } from "@/components/portal/PortalTabs";

/**
 * The portal shell.
 *
 * Sidebar on large screens, bottom tab bar on small ones, one top bar across
 * both. The main column carries bottom padding on mobile so the tab bar never
 * covers the last card on the page.
 */
export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Sidebar needs the journey to draw its miniature staircase. Once an API
  // exists this becomes a fetch; the components do not change.
  const { client, journey } = buildPortalData();

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <PortalSidebar journey={journey} />

      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopBar client={client} />
        <main id="main" className="flex-1 pb-24 lg:pb-10">
          {children}
        </main>
      </div>

      <PortalTabs />
    </div>
  );
}
