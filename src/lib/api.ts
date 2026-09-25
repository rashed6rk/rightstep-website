import type { JourneyStep, Turn, Session, Deliverable, PastSession } from "./portal";
import type { AdminClient, AdminBooking, AdminResource } from "./admin";

const API_BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rs_token");
}

async function api<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

// ─── Portal ───

export type PortalDashboard = {
  profile: { company: string; industry: string; goals: string } | null;
  journey: JourneyStep[];
  turn: Turn;
  nextSession: Session | null;
  deliverables: Deliverable[];
};

export async function getPortalDashboard(): Promise<PortalDashboard> {
  return api("/portal/dashboard.php");
}

export type PortalSessions = {
  upcomingSessions: Session[];
  pastSessions: PastSession[];
};

export async function getPortalSessions(): Promise<PortalSessions> {
  return api("/portal/sessions.php");
}

export type PortalResources = {
  deliverables: Deliverable[];
};

export async function getPortalResources(): Promise<PortalResources> {
  return api("/portal/resources.php");
}

// ─── Admin ───

export type AdminStats = {
  activeClients: number;
  monthlyRevenueAed: number;
  sessionsThisWeek: number;
  needsAttention: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  return api("/admin/stats.php");
}

export async function getAdminClients(): Promise<{ clients: AdminClient[] }> {
  return api("/admin/clients.php");
}

export async function getAdminClient(id: number): Promise<{
  client: AdminClient;
  sessions: AdminBooking[];
  resources: AdminResource[];
}> {
  return api(`/admin/clients.php?id=${id}`);
}

export async function createClient(data: {
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry?: string;
  password?: string;
}): Promise<{ success: boolean; id: number }> {
  return api("/admin/clients.php", { action: "create", ...data });
}

export async function updateClient(
  id: number,
  data: Record<string, unknown>,
): Promise<{ success: boolean }> {
  return api("/admin/clients.php", { action: "update", id, ...data });
}

export async function deleteClient(id: number): Promise<{ success: boolean }> {
  return api("/admin/clients.php", { action: "delete", id });
}

export async function getAdminSessions(): Promise<{ sessions: AdminBooking[] }> {
  return api("/admin/sessions.php");
}

export async function createSession(data: {
  client_id: number;
  title_key?: string;
  start_at: string;
  duration_minutes?: number;
  consultant?: string;
  meet_url?: string;
}): Promise<{ success: boolean; id: number }> {
  return api("/admin/sessions.php", { action: "create", ...data });
}

export async function updateSession(
  id: number,
  data: Record<string, unknown>,
): Promise<{ success: boolean }> {
  return api("/admin/sessions.php", { action: "update", id, ...data });
}

export async function deleteSession(id: number): Promise<{ success: boolean }> {
  return api("/admin/sessions.php", { action: "delete", id });
}

export async function getAdminResources(): Promise<{ resources: AdminResource[] }> {
  return api("/admin/resources.php");
}

export async function createResource(data: {
  client_id: number;
  name_key: string;
  kind: string;
  size_kb?: number;
  step_key?: string;
  file_url?: string;
}): Promise<{ success: boolean; id: number }> {
  return api("/admin/resources.php", { action: "create", ...data });
}

export async function deleteResource(id: number): Promise<{ success: boolean }> {
  return api("/admin/resources.php", { action: "delete", id });
}

export async function runMigration(): Promise<{ results: string[] }> {
  return api("/run-migrate-v2.php");
}
