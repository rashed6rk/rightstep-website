import { useLocale, useTranslations } from "next-intl";
import { numberLocale } from "@/lib/format";
import {
  deliverableKindIcon,
  deliverableKindTone,
  formatFileSize,
  type Deliverable,
  type ResourceCategory,
} from "@/lib/portal";
import { Icon, type IconName } from "../Icon";

const categoryIcon: Record<ResourceCategory, IconName> = {
  strategy: "strategy",
  marketing: "marketing",
  presentations: "presentations",
};

/**
 * One category of the library — the pile a client actually thinks in
 * (Strategy / Marketing / Presentations), not the file kind underneath.
 * Grouping happens once, in the page; this renders whatever list it's given.
 */
export function ResourceCategorySection({
  category,
  items,
}: {
  category: ResourceCategory;
  items: Deliverable[];
}) {
  const t = useTranslations("portal.resources");
  const tDeliverables = useTranslations("portal.deliverables");
  const locale = useLocale();

  const nameKey = `category${category[0].toUpperCase()}${category.slice(1)}Name` as "categoryStrategyName";
  const descKey = `category${category[0].toUpperCase()}${category.slice(1)}Desc` as "categoryStrategyDesc";

  const dateFmt = new Intl.DateTimeFormat(numberLocale(locale), {
    day: "numeric",
    month: "short",
  });

  return (
    <section
      aria-labelledby={`res-${category}-heading`}
      className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800">
          <Icon name={categoryIcon[category]} className="h-5 w-5" />
        </span>
        <div>
          <h2
            id={`res-${category}-heading`}
            className="text-base font-bold text-heading"
          >
            {t(nameKey)}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">{t(descKey)}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{t("emptyCategory")}</p>
      ) : (
        <ul className="mt-4 flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="border-t border-line first:border-t-0">
              <div className="flex flex-wrap items-center gap-3.5 py-3.5">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${deliverableKindTone[item.kind]}`}
                >
                  <Icon
                    name={deliverableKindIcon[item.kind]}
                    className="h-5 w-5"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-heading">
                    {tDeliverables(item.nameKey as "launchWorkbook")}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {tDeliverables(
                      `kind${item.kind[0].toUpperCase()}${item.kind.slice(1)}` as "kindWorkbook",
                    )}
                    {" · "}
                    {formatFileSize(item.sizeKb, numberLocale(locale))}
                    {" · "}
                    {tDeliverables("updated", {
                      date: dateFmt.format(new Date(item.updatedISO)),
                    })}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  <a
                    href="#"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-bold text-heading transition-colors hover:border-navy/40 sm:text-sm"
                  >
                    <Icon name="external" className="h-4 w-4" />
                    {t("view")}
                  </a>
                  <a
                    href="#"
                    download
                    aria-label={`${t("download")} — ${tDeliverables(item.nameKey as "launchWorkbook")}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-heading transition-colors hover:border-navy/40 hover:bg-navy/[0.04]"
                  >
                    <Icon name="download" className="h-4 w-4" />
                  </a>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
