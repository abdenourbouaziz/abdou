import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Link } from "@/i18n/navigation";
import { isAppLocale, locales } from "@/i18n/routing";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isAppLocale(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();
  const nav = await getTranslations("nav");

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleProvider>
        <div
          lang={locale}
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="min-h-screen bg-zinc-50 font-sans text-foreground dark:bg-black"
        >
          <header className="border-b border-black/10 bg-background/80 backdrop-blur dark:border-white/10">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 ps-6 pe-6 py-4 rtl:flex-row-reverse">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                DZ
              </Link>

              <nav className="hidden items-center gap-6 text-sm sm:flex rtl:flex-row-reverse">
                <Link href="/" className="hover:text-foreground">
                  {nav("home")}
                </Link>
                <Link href="/categories" className="hover:text-foreground">
                  {nav("categories")}
                </Link>
                <Link href="/checkout" className="hover:text-foreground">
                  {nav("checkout")}
                </Link>
              </nav>

              <LanguageSwitcher />
            </div>
          </header>

          <div className="mx-auto max-w-5xl ps-6 pe-6 pt-6">
            <Breadcrumbs />
          </div>

          <main className="mx-auto max-w-5xl ps-6 pe-6 py-10">{children}</main>

          <footer className="border-t border-black/10 py-8 text-center text-xs text-foreground/60 dark:border-white/10">
            <div className="mx-auto max-w-5xl ps-6 pe-6">© {new Date().getFullYear()} DZ</div>
          </footer>
        </div>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
