'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product, getProductReviews, products } from '@/lib/data';

interface ProductDetailsProps {
  product: Product;
  locale: string;
}

export function ProductDetails({ product, locale }: ProductDetailsProps) {
  const reviews = getProductReviews(product.id);
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Media Gallery */}
        <div>
          <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                -{discountPercent}%
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    activeImage === index
                      ? 'border-slate-900 dark:border-white'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover hover:scale-110 transition"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-slate-300'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-slate-500 dark:text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-8">
            {product.stock > 0 ? (
              <div className="text-green-600 dark:text-green-400 font-semibold">
                ✓ In Stock ({product.stock} available)
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400 font-semibold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Color
              </label>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.code}
                    onClick={() => setSelectedColor(variant.color)}
                    className={`px-4 py-2 rounded border-2 font-medium transition ${
                      selectedColor === variant.color
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-900 dark:hover:border-white'
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-slate-300 dark:border-slate-700 rounded py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                min="1"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              disabled={product.stock === 0}
              className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button className="flex-1 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              ♥ Add to Wishlist
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div>🚚 Free shipping on orders over $50</div>
            <div>↩️ 30-day return policy</div>
            <div>✓ Secure checkout</div>
          </div>
        </div>
      </div>

      {/* Specs Section */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="mb-16 border-t border-b border-slate-200 dark:border-slate-700 py-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key}>
                <dt className="font-semibold text-slate-900 dark:text-white capitalize">
                  {key}
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">{value}</dd>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Customer Reviews ({product.reviewCount})
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-6 mb-12">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-500' : 'text-slate-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {review.title}
                    </h3>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {review.content}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {review.author} • {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {/* Review Form */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Write a Review
          </h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className="text-3xl hover:text-yellow-500 transition"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Summary of your review"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Review
              </label>
              <textarea
                placeholder="Share your experience with this product"
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            >
              Submit Review
            </button>
          </form>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            * Only verified purchases can post reviews
          </p>
        </div>
      </section>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Related Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/${locale}/products/${relatedProduct.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-48">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {relatedProduct.name}
                  </h3>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ${relatedProduct.price}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
