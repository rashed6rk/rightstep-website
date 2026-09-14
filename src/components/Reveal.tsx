"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Adds `is-visible` once the element enters the viewport, and nothing else —
 * the animation itself belongs to the caller's CSS.
 *
 * Used in exactly one place: the staircase. A single authored moment reads as
 * intent; the same fade-up on every section reads as a default nobody chose.
 */
export function InView({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ol" | "ul" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`${className} ${visible ? "is-visible" : ""}`}
    >
      {children}
    </Tag>
  );
}
