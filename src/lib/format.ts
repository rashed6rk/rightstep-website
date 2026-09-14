/**
 * Arabic copy across this site uses Arabic-Indic digits (٩٥٠), so money and
 * counts must match rather than switching to Latin mid-sentence. Node and
 * browser ICU default `ar` to Latin digits, hence the explicit `-u-nu-arab`.
 *
 * Worth a decision before launch: UAE business Arabic frequently uses Latin
 * digits for prices. Drop the extension here to switch the whole site at once.
 */
export function numberLocale(locale: string) {
  return locale === "ar" ? "ar-u-nu-arab" : "en-AE";
}

export function formatAmount(value: number, locale: string) {
  return new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(numberLocale(locale)).format(value);
}

/** UAE standard rate. Kept here so the checkout never hard-codes it inline. */
export const VAT_RATE = 0.05;
