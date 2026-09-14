import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale } from "@/lib/format";
import type { AdminClient } from "@/lib/admin";
import { Icon } from "../Icon";

/**
 * Every client currently waiting on a reply from the owner — the admin
 * equivalent of the client portal's TurnCard, aggregated across the whole
 * roster instead of shown one at a time. This is the list an owner who logs
 * in once a day should read first: it is the whole reason to check in.
 */
export function AttentionList({ clients }: { clients: AdminClient[] }) {
  const t = useTranslations("admin.attention");
  const locale = useLocale();

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
  });

  return (
    <section
      aria-labelledby="attention-heading"
      className="rounded-2xl border border-coral-200 bg-coral-50 p-5 sm:p-6"
    >
      <h2
        id="attention-heading"
        className="flex items-center gap-2 text-sm font-bold text-coral-ink"
      >
        <Icon name="attention" className="h-4.5 w-4.5" />
        {t("title")}
      </h2>

      {clients.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-3 flex flex-col">
          {clients.map((client) => (
            <li
              key={client.id}
              className="border-t border-coral-200/70 py-3 first:border-t-0"
            >
              <Link
                href={`/admin/clients/${client.id}`}
                className="group flex items-center gap-3.5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-xs font-bold text-white">
                  {client.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-heading">
                    {client.company}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {t("since", {
                      date: dateFmt.format(new Date(client.turnSinceISO)),
                    })}
                  </span>
                </span>
                <Icon
                  name="arrow"
                  flipRtl
                  className="h-4 w-4 shrink-0 text-coral-ink transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
