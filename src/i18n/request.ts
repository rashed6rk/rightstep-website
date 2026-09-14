import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  // For static export: prefer the explicit `locale` parameter (set by
  // setRequestLocale / passed by getTranslations({ locale })) so we never
  // fall through to `requestLocale`, which reads `headers()` at runtime.
  const requested = locale ?? (await requestLocale);
  const resolved = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
