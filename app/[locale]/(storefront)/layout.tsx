import { ReactNode } from 'react';

export default async function StorefrontLayout({
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              Store
            </div>
            <div className="flex gap-8">
              <a href={`/${locale}`} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Home
              </a>
              <a href={`/${locale}/categories/electronics`} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Catalog
              </a>
              <a href={`/${locale}/flash-sales`} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Flash Sales
              </a>
              <a href={`/${locale}/search`} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Search
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href={`/${locale}`} className="hover:text-slate-900 dark:hover:text-white">Home</a></li>
                <li><a href={`/${locale}/categories/electronics`} className="hover:text-slate-900 dark:hover:text-white">Electronics</a></li>
                <li><a href={`/${locale}/categories/fashion`} className="hover:text-slate-900 dark:hover:text-white">Fashion</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Language</h3>
              <div className="flex gap-2">
                <a href={`/en`} className="text-sm px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700">
                  EN
                </a>
                <a href={`/ar`} className="text-sm px-3 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700">
                  AR
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 Storefront. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
