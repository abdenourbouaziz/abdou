import { categories, products } from '@/lib/data';
import Link from 'next/link';
import { getActiveFlashSales } from '@/lib/data';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({
  params: { locale },
}: HomePageProps) {
  const activeFlashSales = getActiveFlashSales();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-xl text-slate-300 mb-8">
              Discover premium products with unbeatable prices
            </p>
            <Link
              href={`/${locale}/categories/electronics`}
              className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-slate-900 dark:text-white">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-slate-900 dark:text-white">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* Flash Sales */}
      {activeFlashSales.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-slate-900 dark:text-white">
              Flash Sales
            </h2>
            <div className="space-y-4">
              {activeFlashSales.map((sale) => (
                <Link
                  key={sale.id}
                  href={`/${locale}/flash-sales`}
                  className="block bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{sale.title}</h3>
                      {sale.description && (
                        <p className="text-orange-100">{sale.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{sale.discount}%</div>
                      <div className="text-sm text-orange-100">OFF</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Delivery & Support */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Fast & Free Delivery
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                On orders over $50
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Easy Returns
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                30-day return policy
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                24/7 Support
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Customer support team
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
