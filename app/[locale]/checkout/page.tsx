import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import CheckoutSummary from "@/components/CheckoutSummary";
import { isAppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    title: t("checkoutTitle"),
    description: t("checkoutDescription"),
    alternates: {
      languages: {
        fr: "/fr/checkout",
        ar: "/ar/checkout",
      },
    },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "checkout",
  });

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-foreground/70">{t("subtitle")}</p>
      </header>

      <CheckoutSummary />
    </div>
  );
}
