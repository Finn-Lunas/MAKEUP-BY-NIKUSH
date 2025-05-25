// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// виводимо union-тип із масиву локалей
type AppLocale = (typeof routing)["locales"][number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale; // string | undefined

  const isSupported = (l: string): l is AppLocale =>
    routing.locales.includes(l as AppLocale);

  const locale: AppLocale =
    requested && isSupported(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // ⬇️ тепер піднімаємося на 1 рівень, а не на 2
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
