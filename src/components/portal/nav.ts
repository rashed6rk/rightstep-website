import type { IconName } from "../Icon";

/**
 * One source of truth for portal navigation: the sidebar, the mobile tab bar
 * and the overflow sheet all read this, so they can never drift apart.
 */
export const portalNav = [
  { href: "/portal", key: "overview", icon: "overview" },
  { href: "/portal/bookings", key: "bookings", icon: "calendar" },
  { href: "/portal/resources", key: "resources", icon: "folder" },
  { href: "/portal/profile", key: "profile", icon: "user" },
] as const satisfies readonly {
  href: string;
  key: string;
  icon: IconName;
}[];
