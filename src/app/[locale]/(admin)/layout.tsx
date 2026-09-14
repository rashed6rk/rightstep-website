import { setRequestLocale } from "next-intl/server";
import { buildAdminData } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminTabs } from "@/components/admin/AdminTabs";

/**
 * The owner's console shell — sidebar on desktop, bottom tabs on mobile, one
 * top bar across both. Deliberately the same skeleton as the client portal's
 * layout, so the two consoles read as one product built by the same hand
 * rather than two different tools bolted together.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { stats } = buildAdminData();

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <AdminSidebar stats={stats} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main id="main" className="flex-1 pb-24 lg:pb-10">
          {children}
        </main>
      </div>

      <AdminTabs />
    </div>
  );
}
