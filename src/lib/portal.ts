import type { ServiceKey } from "./site";
import type { IconName } from "@/components/Icon";

/**
 * Mock client data for the portal.
 *
 * Deliberately shaped like an API response so swapping in a real backend is a
 * change of source, not a change of components. Dates are ISO strings and
 * relative to `now` where the UI depends on elapsed time — a hard-coded past
 * date would make the "join meeting" states impossible to demo.
 */

export type StepStatus = "done" | "current" | "upcoming";

export type JourneyStep = {
  key: string;
  status: StepStatus;
  /** ISO date the step closed, for completed steps. */
  completedOn?: string;
  /** How many deliverables came out of it. */
  deliverables: number;
};

/** Who the engagement is waiting on. The portal's most important single fact. */
export type Turn = "client" | "firm" | "clear";

export type Session = {
  id: string;
  titleKey: string;
  startISO: string;
  minutes: number;
  consultant: string;
  meetUrl: string;
  /** Google Calendar template link — replace with a real event link. */
  calendarUrl: string;
};

export type Deliverable = {
  id: string;
  nameKey: string;
  kind: "workbook" | "deck" | "calendar" | "reel" | "report";
  sizeKb: number;
  updatedISO: string;
  stepKey: string;
};

export type PortalClient = {
  name: string;
  company: string;
  industry: ServiceKey;
  initials: string;
  email: string;
  phone: string;
  goals: string;
};

/** A bookable session length. Drives both the booking engine and any future
 * calendar-API payload — `durationMinutes` is what gets sent as the event
 * length once a real provider is wired in. */
export type SessionType = {
  key: "quick" | "full" | "workshop";
  durationMinutes: number;
};

export const sessionTypes: SessionType[] = [
  { key: "quick", durationMinutes: 15 },
  { key: "full", durationMinutes: 60 },
  { key: "workshop", durationMinutes: 120 },
];

export type PastSession = {
  id: string;
  titleKey: string;
  startISO: string;
  minutes: number;
  consultant: string;
  hasNotes: boolean;
};

/** The three practical piles a client actually thinks in, not the six file
 * kinds underneath — "workbook" and "report" are both strategy to a client. */
export type ResourceCategory = "strategy" | "marketing" | "presentations";

export function deliverableCategory(
  kind: Deliverable["kind"],
): ResourceCategory {
  switch (kind) {
    case "workbook":
    case "report":
      return "strategy";
    case "calendar":
    case "reel":
      return "marketing";
    case "deck":
      return "presentations";
  }
}

/** Icon + tone per file kind — the single source both the Overview preview
 * and the full Resources page read from, so a new file kind only needs one
 * mapping entry to render correctly everywhere. */
export const deliverableKindIcon: Record<Deliverable["kind"], IconName> = {
  workbook: "folder",
  deck: "overview",
  calendar: "calendar",
  reel: "video",
  report: "receipt",
};

export const deliverableKindTone: Record<Deliverable["kind"], string> = {
  workbook: "bg-teal-50 text-teal-ink",
  deck: "bg-gold-50 text-gold-ink",
  calendar: "bg-navy-50 text-navy-800",
  reel: "bg-coral-50 text-coral-ink",
  report: "bg-ink-100 text-ink-700",
};

/** MB above 1024KB, KB below — the same threshold everywhere a file size is
 * shown, so a workbook doesn't read "2480 KB" next to a reel reading "18 MB". */
export function formatFileSize(kb: number, locale: string) {
  const value = kb >= 1024 ? kb / 1024 : kb;
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);
  return `${formatted} ${kb >= 1024 ? "MB" : "KB"}`;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Anchored to load time so the next-session card can be seen in every state.
 * Change `offsetHours` to demo: 0.2 → "join now", 20 → "tomorrow".
 */
export function buildPortalData(now = Date.now(), offsetHours = 30) {
  const client: PortalClient = {
    name: "اسم العميل",
    company: "الشركة",
    industry: "communication",
    initials: "ع",
    email: "client@example.ae",
    phone: "+971501234567",
    goals:
      "Deliver a confident keynote at the company all-hands in Q2 without notes.",
  };

  const journey: JourneyStep[] = [
    {
      key: "learn",
      status: "done",
      completedOn: new Date(now - 32 * DAY).toISOString(),
      deliverables: 1,
    },
    {
      key: "practice",
      status: "done",
      completedOn: new Date(now - 9 * DAY).toISOString(),
      deliverables: 2,
    },
    { key: "improve", status: "current", deliverables: 3 },
    { key: "impact", status: "upcoming", deliverables: 0 },
  ];

  // `as Turn` rather than a plain annotation: TypeScript narrows a const
  // initialised with a literal, which would then tell the UI the other two
  // states are unreachable. Flip this value to demo "firm" or "clear".
  const turn = "client" as Turn;

  // Snap to the next half hour so the demo never shows a meeting at 6:54.
  const rawStart = now + offsetHours * HOUR;
  const halfHour = 30 * MINUTE;
  const sessionStart = Math.ceil(rawStart / halfHour) * halfHour;

  const nextSession: Session = {
    id: "sess-104",
    titleKey: "coachingSession",
    startISO: new Date(sessionStart).toISOString(),
    minutes: 45,
    consultant: "د. عبدالهادي",
    meetUrl: "https://meet.google.com/abc-defg-hij",
    calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE",
  };

  const deliverables: Deliverable[] = [
    {
      id: "d-31",
      nameKey: "practiceWorkbook",
      kind: "workbook",
      sizeKb: 2480,
      updatedISO: new Date(now - 2 * DAY).toISOString(),
      stepKey: "practice",
    },
    {
      id: "d-30",
      nameKey: "practiceSchedule",
      kind: "calendar",
      sizeKb: 640,
      updatedISO: new Date(now - 5 * DAY).toISOString(),
      stepKey: "practice",
    },
    {
      id: "d-28",
      nameKey: "developmentPlan",
      kind: "deck",
      sizeKb: 8120,
      updatedISO: new Date(now - 9 * DAY).toISOString(),
      stepKey: "learn",
    },
    {
      id: "d-27",
      nameKey: "rehearsalRecording",
      kind: "reel",
      sizeKb: 18400,
      updatedISO: new Date(now - 6 * DAY).toISOString(),
      stepKey: "improve",
    },
    {
      id: "d-19",
      nameKey: "speakingAssessment",
      kind: "report",
      sizeKb: 1380,
      updatedISO: new Date(now - 28 * DAY).toISOString(),
      stepKey: "learn",
    },
  ];

  const upcomingSessions: Session[] = [
    nextSession,
    {
      id: "sess-107",
      titleKey: "keynotePrep",
      startISO: new Date(sessionStart + 6 * DAY).toISOString(),
      minutes: 120,
      consultant: "د. عبدالهادي",
      meetUrl: "https://meet.google.com/xyz-uvwx-rst",
      calendarUrl:
        "https://calendar.google.com/calendar/render?action=TEMPLATE",
    },
  ];

  const pastSessions: PastSession[] = [
    {
      id: "sess-092",
      titleKey: "planWalkthrough",
      startISO: new Date(now - 9 * DAY).toISOString(),
      minutes: 60,
      consultant: "د. عبدالهادي",
      hasNotes: true,
    },
    {
      id: "sess-081",
      titleKey: "diagnosisReadout",
      startISO: new Date(now - 28 * DAY).toISOString(),
      minutes: 60,
      consultant: "د. عبدالهادي",
      hasNotes: true,
    },
    {
      id: "sess-070",
      titleKey: "discoveryCall",
      startISO: new Date(now - 46 * DAY).toISOString(),
      minutes: 30,
      consultant: "د. عبدالهادي",
      hasNotes: false,
    },
  ];

  return {
    client,
    journey,
    turn,
    nextSession,
    upcomingSessions,
    pastSessions,
    deliverables,
  };
}

export type PortalData = ReturnType<typeof buildPortalData>;

/** The four skill-development steps (Learn → Practice → Improve → Impact),
 * keyed to the marketing site's own step content. Kept as one source of truth
 * so the portal's journey tracker and the marketing staircase never disagree
 * about which stage a client is on. */
export const stepKeys = [
  "learn",
  "practice",
  "improve",
  "impact",
] as const;

/**
 * How a session behaves depends only on how far away it is, so the card reads
 * its state from one function rather than scattering time maths through JSX.
 */
export type SessionPhase = "future" | "soon" | "live" | "ended";

export function sessionPhase(startISO: string, minutes: number, now: number) {
  const start = new Date(startISO).getTime();
  const end = start + minutes * MINUTE;
  if (now >= end) return "ended" as const;
  if (now >= start) return "live" as const;
  if (start - now <= HOUR) return "soon" as const;
  return "future" as const;
}

/** Whole units, largest first — "in 2 days", "in 30 minutes". */
export function relativeParts(targetISO: string, now: number) {
  const diff = new Date(targetISO).getTime() - now;
  const abs = Math.abs(diff);
  if (abs >= DAY) return { value: Math.round(diff / DAY), unit: "day" as const };
  if (abs >= HOUR)
    return { value: Math.round(diff / HOUR), unit: "hour" as const };
  return { value: Math.round(diff / MINUTE), unit: "minute" as const };
}
