import type { ServiceKey } from "./site";
import type { Turn } from "./portal";
import { stepKeys } from "./portal";

/**
 * Mock data for the owner-facing admin dashboard.
 *
 * Same principle as lib/portal.ts: shaped like an API response so a real
 * backend is a change of source, not of components. This is the business
 * owner's single console — client roster, every session across every client,
 * the shared resource library, and what needs their attention today — the
 * explicit goal being that they never have to open a second tool.
 */

export type ClientStatus = "active" | "paused" | "completed";

export type AdminClient = {
  id: string;
  name: string;
  company: string;
  industry: ServiceKey;
  initials: string;
  email: string;
  phone: string;
  status: ClientStatus;
  stepKey: (typeof stepKeys)[number];
  turn: Turn;
  /** ISO date the ball landed on whoever holds it now. */
  turnSinceISO: string;
  nextSessionISO: string | null;
  consultant: string;
  monthlyFeeAed: number;
  lastActivityISO: string;
  joinedISO: string;
};

export type AdminBooking = {
  id: string;
  clientId: string;
  titleKey: string;
  startISO: string;
  minutes: number;
  consultant: string;
  meetUrl: string;
};

export type AdminResource = {
  id: string;
  clientId: string;
  nameKey: string;
  kind: "workbook" | "deck" | "calendar" | "reel" | "report";
  updatedISO: string;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** The business owner using the console — a person, not the brand, so the
 * greeting reads as "Good morning, Dr. Abdulhadi" and not "Good morning,
 * Right Step". Founder of Right Step Consultancy and the practice's Trainer
 * of Trainers, per the brand master doc. */
export const owner = { name: "د. عبدالهادي", nameEn: "Dr. Abdulhadi", initials: "DA" };

export function buildAdminData(now = Date.now()) {
  // Six mocked clients across the six practices, spread across the four
  // skill-journey steps so every stage has something to render in the UI.
  // Coach names lifted from the master doc's placeholder examples; the real
  // roster of trainers/coaches will replace these when the API is wired.
  const clients: AdminClient[] = [
    {
      id: "c-demo",
      name: "عميل تجريبي",
      company: "شركة تجريبية",
      industry: "communication",
      initials: "ع",
      email: "client@example.ae",
      phone: "+971501234567",
      status: "active",
      stepKey: "improve",
      turn: "client",
      turnSinceISO: new Date(now - 2 * DAY).toISOString(),
      nextSessionISO: new Date(now + 30 * HOUR).toISOString(),
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 2400,
      lastActivityISO: new Date(now - 6 * HOUR).toISOString(),
      joinedISO: new Date(now - 46 * DAY).toISOString(),
    },
    {
      id: "c-adnoc",
      name: "Aisha Al Mansoori",
      company: "ADNOC L&D",
      industry: "leadership",
      initials: "AM",
      email: "aisha.mansoori@example.ae",
      phone: "+971555550190",
      status: "active",
      stepKey: "practice",
      turn: "firm",
      turnSinceISO: new Date(now - 3 * DAY).toISOString(),
      nextSessionISO: new Date(now + 3 * DAY).toISOString(),
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 12800,
      lastActivityISO: new Date(now - 1 * DAY).toISOString(),
      joinedISO: new Date(now - 20 * DAY).toISOString(),
    },
    {
      id: "c-khalid",
      name: "Khalid Al Nuaimi",
      company: "Khalid Al Nuaimi",
      industry: "coaching",
      initials: "KN",
      email: "khalid.n@example.ae",
      phone: "+971503334477",
      status: "active",
      stepKey: "learn",
      turn: "client",
      turnSinceISO: new Date(now - 5 * DAY).toISOString(),
      nextSessionISO: new Date(now + 5 * HOUR).toISOString(),
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 3600,
      lastActivityISO: new Date(now - 4 * DAY).toISOString(),
      joinedISO: new Date(now - 11 * DAY).toISOString(),
    },
    {
      id: "c-mubadala",
      name: "Sara Al Zaabi",
      company: "Mubadala Talent",
      industry: "corporate",
      initials: "SZ",
      email: "sara.z@example.ae",
      phone: "+971521239988",
      status: "active",
      stepKey: "impact",
      turn: "clear",
      turnSinceISO: new Date(now - 1 * DAY).toISOString(),
      nextSessionISO: new Date(now + 9 * DAY).toISOString(),
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 18500,
      lastActivityISO: new Date(now - 2 * DAY).toISOString(),
      joinedISO: new Date(now - 70 * DAY).toISOString(),
    },
    {
      id: "c-events",
      name: "Yousef Rahman",
      company: "Presidential Court Events",
      industry: "events",
      initials: "YR",
      email: "yousef.r@example.ae",
      phone: "+971509981122",
      status: "paused",
      stepKey: "practice",
      turn: "clear",
      turnSinceISO: new Date(now - 14 * DAY).toISOString(),
      nextSessionISO: null,
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 6500,
      lastActivityISO: new Date(now - 14 * DAY).toISOString(),
      joinedISO: new Date(now - 60 * DAY).toISOString(),
    },
    {
      id: "c-supplier",
      name: "Deema Al Suwaidi",
      company: "Aldar Procurement",
      industry: "supplier",
      initials: "DS",
      email: "deema.s@example.ae",
      phone: "+971567781234",
      status: "completed",
      stepKey: "impact",
      turn: "clear",
      turnSinceISO: new Date(now - 30 * DAY).toISOString(),
      nextSessionISO: null,
      consultant: "د. عبدالهادي",
      monthlyFeeAed: 8200,
      lastActivityISO: new Date(now - 30 * DAY).toISOString(),
      joinedISO: new Date(now - 140 * DAY).toISOString(),
    },
  ];

  const bookings: AdminBooking[] = clients
    .filter((c) => c.nextSessionISO)
    .map((c, i) => ({
      id: `bk-${c.id}`,
      clientId: c.id,
      titleKey: (["catalogueReview", "planWalkthrough", "diagnosisReadout"] as const)[
        i % 3
      ],
      startISO: c.nextSessionISO as string,
      minutes: 60,
      consultant: c.consultant,
      meetUrl: `https://meet.google.com/mock-${c.id}`,
    }))
    .sort((a, b) => a.startISO.localeCompare(b.startISO));

  const resources: AdminResource[] = [
    {
      id: "ar-1",
      clientId: "c-fatima",
      nameKey: "practiceWorkbook",
      kind: "workbook",
      updatedISO: new Date(now - 2 * DAY).toISOString(),
    },
    {
      id: "ar-2",
      clientId: "c-fatima",
      nameKey: "practiceSchedule",
      kind: "calendar",
      updatedISO: new Date(now - 5 * DAY).toISOString(),
    },
    {
      id: "ar-3",
      clientId: "c-adnoc",
      nameKey: "developmentPlan",
      kind: "deck",
      updatedISO: new Date(now - 3 * DAY).toISOString(),
    },
    {
      id: "ar-4",
      clientId: "c-khalid",
      nameKey: "speakingAssessment",
      kind: "report",
      updatedISO: new Date(now - 5 * DAY).toISOString(),
    },
    {
      id: "ar-5",
      clientId: "c-mubadala",
      nameKey: "rehearsalRecording",
      kind: "reel",
      updatedISO: new Date(now - 1 * DAY).toISOString(),
    },
  ];

  const activeClients = clients.filter((c) => c.status === "active");
  const stats = {
    activeClients: activeClients.length,
    monthlyRevenueAed: activeClients.reduce(
      (sum, c) => sum + c.monthlyFeeAed,
      0,
    ),
    sessionsThisWeek: bookings.filter(
      (b) => new Date(b.startISO).getTime() - now < 7 * DAY,
    ).length,
    needsAttention: clients.filter(
      (c) => c.status === "active" && c.turn === "client",
    ).length,
  };

  return { clients, bookings, resources, stats };
}

export type AdminData = ReturnType<typeof buildAdminData>;

export function getClient(id: string) {
  return buildAdminData().clients.find((c) => c.id === id);
}
