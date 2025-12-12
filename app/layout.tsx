import type { Metadata } from "next";
import { Poppins, Tajawal } from "next/font/google";
import { cookies, headers } from "next/headers";
import type { CSSProperties } from "react";

import "./globals.css";

import { defaultLocale, isAppLocale } from "@/i18n/routing";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DZ",
  description: "Bilingual (FR/AR) Next.js demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const headerLocale = headerStore.get("x-next-intl-locale");
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const candidate = headerLocale ?? cookieLocale;
  const locale = candidate && isAppLocale(candidate) ? candidate : defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontAppSans = locale === "ar" ? "var(--font-tajawal)" : "var(--font-poppins)";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${poppins.variable} ${tajawal.variable}`}
      style={{ "--font-app-sans": fontAppSans } as CSSProperties}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
