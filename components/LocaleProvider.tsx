"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

type LocaleHelpers = {
  locale: string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatCountdown: (seconds: number) => string;
};

const LocaleContext = createContext<LocaleHelpers | null>(null);

function getIntlLocale(locale: string) {
  if (locale === "ar") return "ar-DZ";
  return "fr-DZ";
}

export function LocaleProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = useLocale();
  const t = useTranslations("countdown");

  const formatterLocale = useMemo(() => getIntlLocale(locale), [locale]);

  const formatCurrency = useCallback(
    (amount: number) => {
      return new Intl.NumberFormat(formatterLocale, {
        style: "currency",
        currency: "DZD",
        maximumFractionDigits: 0,
      }).format(amount);
    },
    [formatterLocale]
  );

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const value = typeof date === "string" ? new Date(date) : date;

      return new Intl.DateTimeFormat(formatterLocale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        ...options,
      }).format(value);
    },
    [formatterLocale]
  );

  const formatCountdown = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.floor(seconds));

      const days = Math.floor(clamped / 86_400);
      const hours = Math.floor((clamped % 86_400) / 3_600);
      const minutes = Math.floor((clamped % 3_600) / 60);
      const remainingSeconds = clamped % 60;

      const nf = new Intl.NumberFormat(formatterLocale);

      const parts: string[] = [];
      if (days) parts.push(`${nf.format(days)} ${t("days")}`);
      if (hours || days) parts.push(`${nf.format(hours)} ${t("hours")}`);
      if (minutes || hours || days) parts.push(`${nf.format(minutes)} ${t("minutes")}`);
      parts.push(`${nf.format(remainingSeconds)} ${t("seconds")}`);

      return parts.join(" ");
    },
    [formatterLocale, t]
  );

  const value = useMemo<LocaleHelpers>(
    () => ({ locale, formatCurrency, formatDate, formatCountdown }),
    [formatCurrency, formatCountdown, formatDate, locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleHelpers() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocaleHelpers must be used within <LocaleProvider>");
  }

  return value;
}
