"use client";

import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { buildAdminData } from "@/lib/admin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { AdminTabs } from "./AdminTabs";

const { stats } = buildAdminData();

function AdminInner({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-alt">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-200 border-t-navy" />
      </div>
    );
  }

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

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider require="admin">
      <AdminInner>{children}</AdminInner>
    </AuthProvider>
  );
}
