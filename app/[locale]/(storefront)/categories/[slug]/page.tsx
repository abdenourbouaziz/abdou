import Link from 'next/link';
import { getCategory, getProductsByCategory } from '@/lib/data';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
  searchParams: {
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    inStock?: string;
  };
}

export default async function CategoryPage({
  params: { locale, slug },
  searchParams,
}: CategoryPageProps) {
  const category = getCategory(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Category not found
        </h1>
        <Link
          href={`/${locale}`}
          className="text-blue-500 hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  // Apply filters
  let filteredProducts = products;

  if (searchParams.minPrice || searchParams.maxPrice) {
    const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : 0;
    const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : Infinity;
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
  }

  if (searchParams.rating) {
    const minRating = parseFloat(searchParams.rating);
    filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
  }

  if (searchParams.inStock) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {category.description}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Filters
              </h2>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                  Price Range
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400">
                      Min Price
                    </label>
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={searchParams.minPrice}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400">
                      Max Price
                    </label>
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={searchParams.maxPrice}
                      placeholder="9999"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                  Rating
                </h3>
                <form className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {rating}+ stars
                      </span>
                    </label>
                  ))}
                  <button
                    type="submit"
                    className="mt-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                  Availability
                </h3>
                <form>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      value="true"
                      defaultChecked={searchParams.inStock === 'true'}
                      className="mr-2"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      In Stock Only
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="mt-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-600 dark:text-slate-400">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No products found
                </p>
                <Link
                  href={`/${locale}/categories/${slug}`}
                  className="text-blue-500 hover:underline"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en', slug: 'electronics' },
    { locale: 'en', slug: 'fashion' },
    { locale: 'en', slug: 'home-kitchen' },
    { locale: 'ar', slug: 'electronics' },
    { locale: 'ar', slug: 'fashion' },
    { locale: 'ar', slug: 'home-kitchen' },
  ];
}
