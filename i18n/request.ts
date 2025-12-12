import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isAppLocale } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale && isAppLocale(locale) ? locale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
