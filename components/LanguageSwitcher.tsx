"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");

  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-foreground/80">
      <span className="hidden sm:inline">{t("label")}</span>
      <select
        aria-label={t("label")}
        className="rounded-md border border-black/10 bg-background px-2 py-1 text-sm shadow-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:focus:ring-white/20"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;
          router.replace(pathname, { locale: nextLocale });
        }}
      >
        <option value="fr">{t("fr")}</option>
        <option value="ar">{t("ar")}</option>
      </select>
    </label>
  );
}
