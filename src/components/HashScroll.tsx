"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";

/**
 * The App Router resets scroll position after hydration, which swallows the
 * browser's native jump to a `#hash` on first load. Without this, the footer's
 * deep links (/services#ecommerce, #admin, #hr) land at the top of the page.
 *
 * Targets carry `scroll-mt-28`, so scrollIntoView already clears the fixed
 * header — no manual offset maths needed here.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    // Read the hash at call time, not at setup: on a hashchange the target is
    // a different element than the one this effect was mounted for.
    const jump = () => {
      if (cancelled) return;
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;

      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }

      document
        .getElementById(id)
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    };

    // Three things move the target after hydration: the router's own scroll
    // reset, the horizontal slider collapsing into a scroller, and — the big
    // one — the variable display font swapping in and reflowing every heading.
    // A fixed timeout can't cover that last one; if the swap lands after the
    // final attempt the page is left scrolled to a stale offset. So the early
    // attempts handle the router, and `fonts.ready` handles the reflow
    // whenever it actually happens.
    const timers = [0, 60, 180].map((delay) => window.setTimeout(jump, delay));

    document.fonts?.ready
      .then(() => {
        // A tick after the swap, so reflow is applied before we measure.
        window.setTimeout(jump, 0);
      })
      .catch(() => {});

    // `usePathname` ignores the fragment, so moving between two anchors on the
    // same page never re-runs this effect. The browser usually handles that
    // case natively, but not once our own scrolling has intervened.
    // Called directly rather than inside requestAnimationFrame: rAF is
    // throttled whenever the document isn't being painted, and the jump must
    // still happen. A trailing tick covers any layout the click itself caused.
    const onHashChange = () => {
      jump();
      window.setTimeout(jump, 50);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
