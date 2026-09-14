import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Crown,
  Download,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  Lightbulb,
  LogOut,
  MessageSquare,
  Mic,
  PartyPopper,
  Receipt,
  Repeat,
  Search,
  Sparkles,
  Trophy,
  Upload,
  UserCheck,
  UserRound,
  Video,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  Gauge,
  GraduationCap,
  Landmark,
  Mail,
  Megaphone,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Presentation,
  RotateCw,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ServiceKey } from "@/lib/site";

/**
 * ONE icon system, drawn by Lucide (ISC licensed).
 *
 * Lucide is used rather than hand-authored glyphs because it is a real,
 * professionally drawn set: every icon already shares a 24×24 grid, identical
 * optical sizing, and consistent terminals — the coherence is guaranteed by
 * the library instead of maintained by hand.
 *
 * Two deliberate adjustments to Lucide's defaults, both to fit this brand:
 *
 *   1. strokeWidth 1.75 instead of 2. The interface is built on hairline
 *      rules and thin card borders; Lucide's default 2 reads heavier than
 *      every line beside it. 1.75 sits on the same optical weight.
 *   2. Names are mapped to product concepts (`ecommerce`, not `Store`) so
 *      callers ask for meaning and the glyph can be swapped in one place.
 *
 * Icons are chosen for what this firm actually does, not generic category
 * stand-ins — see the practice map below.
 */

const STROKE = 1.75;

const registry = {
  // — Practices —————————————————————————————————————————
  /** A microphone: the strategic focus of the firm — public speaking and
   *  communication. Chosen over the generic MessageCircle because it says
   *  "you, in front of a room" instead of "chat bubbles". */
  communication: Mic,
  /** A crown: leadership. Not a wreath (too ceremonial) or a chess piece
   *  (too tactical) — just the direct symbol of the role. */
  leadership: Crown,
  /** A user with a check: coaching. One person, being seen and guided —
   *  the whole point of one-to-one work. */
  coaching: UserCheck,
  /** A briefcase: corporate training. The everyday shorthand for "at
   *  work, for the organisation". */
  corporate: Briefcase,
  /** A party popper: events and protocol. Warm, ceremonial, and not
   *  the sterile "calendar" that would confuse the icon with a booking. */
  events: PartyPopper,
  /** A handshake: supplier development. The whole practice is about
   *  the relationship, so the glyph is the relationship. */
  supplier: Handshake,

  // — The 4-step methodology (Learn → Practice → Improve → Impact) ------
  learn: Lightbulb,
  practice: Repeat,
  improve: Sparkles,
  impact: Trophy,
  /** Compass: a general "path / direction" glyph used for the overall
   *  approach section on the marketing site. */
  approach: Compass,

  // — Navigation ————————————————————————————————————————
  arrow: ArrowRight,
  check: Check,
  menu: Menu,
  close: X,

  // — Contact ———————————————————————————————————————————
  phone: Phone,
  mail: Mail,
  pin: MapPin,
  clock: Clock,

  // — Workshop metadata —————————————————————————————————
  level: Gauge,
  seats: Users,

  // — Portal ————————————————————————————————————————————
  overview: LayoutDashboard,
  calendar: CalendarDays,
  folder: FolderOpen,
  user: UserRound,
  bell: Bell,
  search: Search,
  logout: LogOut,
  upload: Upload,
  download: Download,
  message: MessageSquare,
  video: Video,
  receipt: Receipt,
  chevron: ChevronDown,
  external: ArrowUpRight,
  help: LifeBuoy,

  // — Forms and checkout ————————————————————————————————
  eye: Eye,
  eyeOff: EyeOff,
  card: CreditCard,
  wallet: Smartphone,
  bank: Landmark,
  organisation: Building2,
  /** Reassurance beside the payment total — a claim about handling, not decoration. */
  secure: ShieldCheck,
  plus: Plus,
  minus: Minus,

  // — Bookings and resources ——————————————————————————————
  /** Reschedule: the same clock-forward gesture as the marketing site's step icons. */
  reschedule: RotateCw,
  workshop: GraduationCap,
  strategy: Target,
  marketing: Megaphone,
  presentations: Presentation,

  // — Admin dashboard ——————————————————————————————————————
  clients: Users,
  attention: AlertCircle,
  revenue: TrendingUp,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof registry;

export function Icon({
  name,
  className = "h-5 w-5",
  flipRtl = false,
}: {
  name: IconName;
  className?: string;
  /** Mirror under RTL — for glyphs that point along the reading direction. */
  flipRtl?: boolean;
}) {
  const Glyph = registry[name];
  return (
    <Glyph
      aria-hidden="true"
      strokeWidth={STROKE}
      className={`shrink-0 ${flipRtl ? "rtl:-scale-x-100" : ""} ${className}`}
    />
  );
}

/** Practice glyph, keyed the same way services are keyed everywhere else. */
export function ServiceIcon({
  service,
  className = "h-6 w-6",
}: {
  service: ServiceKey;
  className?: string;
}) {
  return <Icon name={service} className={className} />;
}

/**
 * Social marks stay hand-held on purpose. Lucide deliberately removed brand
 * logos from the set — a company's mark is its property and has fixed
 * proportions, so redrawing it as a 1.75-stroke outline to "match" would
 * misrepresent it. These keep their official filled forms.
 */
export const brandMarks = {
  LinkedIn:
    "M4.98 3.5a2 2 0 1 1-.02 4 2 2 0 0 1 .02-4ZM3.5 8.9h3v11.6h-3zM9.4 8.9h2.87v1.59h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.97h-3v-5.3c0-1.26-.02-2.9-1.76-2.9-1.77 0-2.04 1.38-2.04 2.8v5.4h-3z",
  Instagram:
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 2.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM17 6.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z",
  X: "M17.3 3h3.1l-6.77 7.73L21.6 21h-6.23l-4.88-6.38L4.9 21H1.8l7.24-8.27L2.2 3h6.39l4.41 5.83Zm-1.09 16.14h1.72L7.86 4.77H6.02Z",
} as const;

export function BrandMark({
  name,
  className = "h-4.5 w-4.5",
}: {
  name: keyof typeof brandMarks;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={brandMarks[name]} />
    </svg>
  );
}
