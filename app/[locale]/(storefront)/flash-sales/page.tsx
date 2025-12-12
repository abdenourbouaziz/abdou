'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { flashSales, getFlashSaleProducts } from '@/lib/data';

interface FlashSalesPageProps {
  params: {
    locale: string;
  };
}

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex gap-2 text-2xl font-bold">
      <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
        {String(timeLeft.hours).padStart(2, '0')}
      </span>
      <span className="text-slate-400">:</span>
      <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
        {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="text-slate-400">:</span>
      <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function FlashSalesPage({
  params: { locale },
}: FlashSalesPageProps) {
  const now = new Date();
  const activeSales = flashSales.filter((s) => s.startTime <= now && s.endTime > now);
  const upcomingSales = flashSales.filter((s) => s.startTime > now);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-12">
        Flash Sales
      </h1>

      {/* Active Sales */}
      {activeSales.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Active Sales
          </h2>
          <div className="space-y-8">
            {activeSales.map((sale) => {
              const products = getFlashSaleProducts(sale.id);
              const totalProducts = products.length;
              const soldCount = Math.floor(totalProducts * 0.6); // Mock sold count

              return (
                <div
                  key={sale.id}
                  className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{sale.title}</h3>
                      {sale.description && (
                        <p className="text-orange-100 mb-4">{sale.description}</p>
                      )}
                      <div className="text-5xl font-bold mb-4">{sale.discount}%</div>
                      <p className="text-sm text-orange-100 mb-6">Offer ends in:</p>
                      <CountdownTimer endTime={sale.endTime} />
                    </div>

                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span>Stock Progress</span>
                          <span className="text-sm">{soldCount} / {totalProducts} sold</span>
                        </div>
                        <div className="w-full bg-orange-600 rounded-full h-3">
                          <div
                            className="bg-white h-3 rounded-full"
                            style={{ width: `${(soldCount / totalProducts) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/${locale}/products/${product.slug}`}
                            className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                          >
                            <div className="relative overflow-hidden bg-slate-100 h-32">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition"
                              />
                            </div>
                            <div className="p-2">
                              <h4 className="text-xs font-semibold text-slate-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-slate-600">
                                ${product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/categories/electronics`}
                    className="inline-block mt-8 bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition"
                  >
                    Shop Sale
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Sales */}
      {upcomingSales.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingSales.map((sale) => {
              const products = getFlashSaleProducts(sale.id);
              return (
                <div
                  key={sale.id}
                  className="border-2 border-slate-300 dark:border-slate-700 rounded-lg p-8"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {sale.title}
                      </h3>
                      {sale.description && (
                        <p className="text-slate-600 dark:text-slate-400">
                          {sale.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {sale.discount}%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">OFF</div>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Starts in:
                    </p>
                    <CountdownTimer endTime={sale.startTime} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Featured products ({products.length}):
                    </p>
                    <div className="space-y-2">
                      {products.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="text-sm text-slate-900 dark:text-white flex justify-between"
                        >
                          <span>{product.name}</span>
                          <span className="font-semibold">${product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeSales.length === 0 && upcomingSales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">
            No sales available at the moment
          </p>
          <Link
            href={`/${locale}`}
            className="text-blue-500 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      )}
    </div>
  );
}
