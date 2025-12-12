"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Countdown from "./Countdown";
import { useLocaleHelpers } from "./LocaleProvider";

export default function CheckoutSummary() {
  const t = useTranslations("checkout");
  const { formatCurrency, formatDate } = useLocaleHelpers();

  const total = 24900;
  const [now] = useState(() => Date.now());

  const deliveryDate = new Date(now + 4 * 24 * 60 * 60 * 1000);
  const offerEndsAt = now + 2 * 60 * 60 * 1000 + 8 * 60 * 1000 + 12 * 1000;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
      <h2 className="text-base font-semibold tracking-tight">{t("subtitle")}</h2>

      <dl className="mt-6 grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-foreground/70">{t("total")}</dt>
          <dd className="text-sm font-semibold">{formatCurrency(total)}</dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-foreground/70">{t("deliveryDate")}</dt>
          <dd className="text-sm">{formatDate(deliveryDate)}</dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-foreground/70">{t("offerEnds")}</dt>
          <dd className="text-sm">
            <Countdown until={offerEndsAt} />
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
      >
        {t("payNow")}
      </button>
    </section>
  );
}
