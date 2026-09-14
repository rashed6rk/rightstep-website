"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ServiceKey } from "@/lib/site";
import { CheckoutClient, type Workshop } from "./CheckoutClient";
import { Container, CtaButton } from "./ui";

type Props = {
  workshops: Workshop[];
  services: { key: ServiceKey; title: string }[];
  emptyState: { title: string; body: string; cta: string };
};

function seatCap(seats: string) {
  const normalised = [...seats]
    .map((ch) => {
      const arabicIndex = "٠١٢٣٤٥٦٧٨٩".indexOf(ch);
      return arabicIndex >= 0 ? String(arabicIndex) : ch;
    })
    .join("");
  const available = Number.parseInt(normalised.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(available) && available > 0
    ? Math.min(available, 10)
    : 10;
}

function CheckoutInner({ workshops, services, emptyState }: Props) {
  const searchParams = useSearchParams();
  const w = searchParams.get("w");
  const workshop = workshops.find((item) => item.id === w);

  if (!workshop) {
    return (
      <section className="bg-surface pt-[72px] sm:pt-20">
        <Container>
          <div className="flex max-w-xl flex-col items-start gap-5 py-20 sm:py-28">
            <h1 className="text-[2rem] leading-[1.05] font-extrabold text-balance text-heading sm:text-[2.5rem]">
              {emptyState.title}
            </h1>
            <p className="text-base leading-relaxed text-pretty text-ink-muted">
              {emptyState.body}
            </p>
            <CtaButton href="/#workshops">{emptyState.cta}</CtaButton>
          </div>
        </Container>
      </section>
    );
  }

  const practiceName =
    services.find((s) => s.key === workshop.practice)?.title ?? "";

  return (
    <CheckoutClient
      workshop={workshop}
      practiceName={practiceName}
      maxSeats={seatCap(workshop.seats)}
    />
  );
}

export function CheckoutWrapper(props: Props) {
  return (
    <Suspense>
      <CheckoutInner {...props} />
    </Suspense>
  );
}
