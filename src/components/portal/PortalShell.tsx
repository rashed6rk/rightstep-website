"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getPortalDashboard } from "@/lib/api";
import type { JourneyStep } from "@/lib/portal";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopBar } from "./PortalTopBar";
import { PortalTabs } from "./PortalTabs";
import { OverviewSkeleton } from "./Skeleton";

function PortalInner({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [journey, setJourney] = useState<JourneyStep[]>([]);

  useEffect(() => {
    if (user) {
      getPortalDashboard()
        .then((data) => setJourney(data.journey))
        .catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-surface-alt">
        <div className="flex min-w-0 flex-1 flex-col">
          <OverviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <PortalSidebar journey={journey} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopBar />
        <main id="main" className="flex-1 pb-24 lg:pb-10">
          {children}
        </main>
      </div>
      <PortalTabs />
    </div>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PortalInner>{children}</PortalInner>
    </AuthProvider>
  );
}
