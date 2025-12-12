import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Storefront - Premium Products',
  description: 'Discover premium products with unbeatable prices',
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}) {
  const { locale } = await params;
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
