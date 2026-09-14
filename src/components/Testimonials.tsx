import { useTranslations } from "next-intl";
import { Container, SectionHeading } from "./ui";

type Item = { quote: string; name: string; role: string };

/**
 * Ruled columns rather than shadowed cards with initial-avatars. The quote is
 * the content; giving each one a container and a coloured circle only adds
 * furniture between the reader and the sentence.
 */
export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="bg-surface-alt py-20 sm:py-28">
      <Container>
        <SectionHeading title={t("title")} />

        <ul className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={item.name}
              className="border-t-2 pt-6"
              style={{
                borderTopColor: ["#1596A0", "#C9A227", "#12294B"][i],
              }}
            >
              <figure className="flex h-full flex-col">
                <blockquote className="flex-1 text-lg leading-[1.6] text-pretty text-ink sm:text-xl">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-6 text-sm">
                  <span className="block font-bold text-heading">{item.name}</span>
                  <span className="mt-0.5 block text-ink-muted">
                    {item.role}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-10 border-t border-line pt-5 text-xs text-ink-faint">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
