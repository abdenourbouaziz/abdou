export const locales = ["fr", "ar"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fr";

export function isAppLocale(locale: string): locale is AppLocale {
  return (locales as readonly string[]).includes(locale);
}
