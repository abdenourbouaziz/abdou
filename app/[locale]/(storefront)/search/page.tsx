'use client';

import Link from 'next/link';
import { useState } from 'react';
import { products } from '@/lib/data';

interface SearchPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({
  params: { locale },
  searchParams,
}: SearchPageProps) {
  const [query, setQuery] = useState(searchParams.q || '');
  const [submitted, setSubmitted] = useState(!!searchParams.q);

  const filteredProducts = submitted
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        Search Products
      </h1>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
          />
          <button
            type="submit"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
          >
            Search
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mb-8">
          <p className="text-slate-600 dark:text-slate-400">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;
            {query}&quot;
          </p>
        </div>
      )}

      {submitted && filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">
            No products found
          </p>
          <Link
            href={`/${locale}`}
            className="text-blue-500 hover:underline"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    Sale
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-yellow-500">★</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
