import { useTranslations } from "next-intl";
import { Container } from "./ui";

export function ClientStrip() {
  const t = useTranslations("clients");
  const items = t.raw("items") as string[];
  // Duplicated once so the marquee loops seamlessly at -50%.
  const loop = [...items, ...items];

  return (
    <section className="border-b border-line bg-surface py-10 sm:py-12">
      <Container>
        <p className="mb-6 text-center text-xs font-bold tracking-[0.16em] text-ink-faint uppercase">
          {t("label")}
        </p>
      </Container>

      <div className="marquee-mask relative overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-10 sm:gap-16">
          {loop.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= items.length}
              className="text-base font-bold whitespace-nowrap text-ink-muted transition-colors duration-300 hover:text-heading sm:text-lg"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
