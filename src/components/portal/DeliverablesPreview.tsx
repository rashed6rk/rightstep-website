import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { numberLocale } from "@/lib/format";
import {
  deliverableKindIcon,
  deliverableKindTone,
  formatFileSize,
  type Deliverable,
} from "@/lib/portal";
import { Icon } from "../Icon";

/**
 * The three most recent files, not the whole library.
 *
 * The dashboard's job is to surface what changed since the client last looked;
 * browsing everything is what the Resources section is for. Each row states
 * its type in words as well as by icon, so the kind of file is never carried
 * by a glyph alone. Kind → icon/tone comes from lib/portal.ts, the single
 * source the full Resources page also reads from.
 */
export function DeliverablesPreview({ items }: { items: Deliverable[] }) {
  const t = useTranslations("portal.deliverables");
  const locale = useLocale();

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
  });
  const sizeFmt = (kb: number) => formatFileSize(kb, numberLocale(locale));

  return (
    <section
      aria-labelledby="files-heading"
      className="flex flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="files-heading"
          className="text-xs font-bold tracking-[0.14em] text-ink-faint uppercase"
        >
          {t("title")}
        </h2>
        <Link
          href="/portal/resources"
          className="group/link inline-flex min-h-6 items-center gap-1.5 py-1 text-sm font-bold text-heading transition-colors hover:text-coral-ink"
        >
          {t("viewAll")}
          <Icon
            name="arrow"
            flipRtl
            className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="border-t border-line first:border-t-0">
              <div className="flex items-center gap-3.5 py-3.5">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${deliverableKindTone[item.kind]}`}
                >
                  <Icon name={deliverableKindIcon[item.kind]} className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-heading">
                    {t(item.nameKey as "launchWorkbook")}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {t(
                      `kind${item.kind[0].toUpperCase()}${item.kind.slice(1)}` as "kindWorkbook",
                    )}
                    {" · "}
                    {sizeFmt(item.sizeKb)}
                    {" · "}
                    {t("updated", {
                      date: dateFmt.format(new Date(item.updatedISO)),
                    })}
                  </span>
                </span>

                <a
                  href="#"
                  download
                  aria-label={`${t("download")} — ${t(item.nameKey as "launchWorkbook")}`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line text-heading transition-colors hover:border-navy/40 hover:bg-navy/[0.04]"
                >
                  <Icon name="download" className="h-4.5 w-4.5" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
