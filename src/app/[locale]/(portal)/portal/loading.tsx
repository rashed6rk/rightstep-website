import { OverviewSkeleton } from "@/components/portal/Skeleton";

/**
 * Next renders this automatically while the route segment resolves, so the
 * dashboard never shows a frozen or blank frame once it reads live data.
 */
export default function Loading() {
  return <OverviewSkeleton />;
}
