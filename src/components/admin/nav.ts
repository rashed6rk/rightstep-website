import type { IconName } from "../Icon";

/** One source of truth for admin navigation — sidebar, mobile tabs, and the
 * overflow sheet all read this, so they can never drift apart. */
export const adminNav = [
  { href: "/admin", key: "overview", icon: "overview" },
  { href: "/admin/clients", key: "clients", icon: "clients" },
  { href: "/admin/bookings", key: "bookings", icon: "calendar" },
  { href: "/admin/resources", key: "resources", icon: "folder" },
] as const satisfies readonly {
  href: string;
  key: string;
  icon: IconName;
}[];
