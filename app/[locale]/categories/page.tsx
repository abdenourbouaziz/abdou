import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
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
    title: t("categoriesTitle"),
    description: t("categoriesDescription"),
    alternates: {
      languages: {
        fr: "/fr/categories",
        ar: "/ar/categories",
      },
    },
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "categories",
  });

  const categoryKeys = ["electronics", "fashion", "beauty", "home"] as const;

  return (
    <div className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-foreground/70">
          <Link href="/checkout" className="underline underline-offset-4">
            {t("cta")}
          </Link>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryKeys.map((key) => (
          <article
            key={key}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black"
          >
            <h2 className="text-sm font-semibold">{t(key)}</h2>
            <p className="mt-2 text-sm text-foreground/70">
              {t("cta")} · {t(key)}
            </p>
            <Link
              href="/checkout"
              className="mt-4 inline-flex rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {t("cta")}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
