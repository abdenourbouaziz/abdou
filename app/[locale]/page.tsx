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
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: {
      languages: {
        fr: "/fr",
        ar: "/ar",
      },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "hero" });
  const categories = await getTranslations({
    locale,
    namespace: "categories",
  });

  const categoryKeys = ["electronics", "fashion", "beauty", "home"] as const;

  return (
    <div className="grid gap-12">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <div className="mx-auto grid max-w-3xl gap-4 text-center">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-pretty text-sm text-foreground/70 sm:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-4 flex flex-col items-stretch justify-center gap-3 sm:flex-row rtl:sm:flex-row-reverse">
            <Link
              href="/categories"
              className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/checkout"
              className="rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm font-semibold shadow-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold tracking-tight">{categories("title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryKeys.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black"
            >
              <h3 className="text-sm font-semibold">{categories(key)}</h3>
              <Link
                href="/categories"
                className="mt-4 inline-flex text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                {categories("cta")}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
