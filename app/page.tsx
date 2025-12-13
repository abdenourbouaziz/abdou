'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useSession } from 'next-auth/react'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  stockQuantity: number
  description?: string
}

export default function Home() {
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    if (!session) {
      // Redirect to login or show auth modal
      return
    }
    await addToCart(productId, 1)
  }

  const handleToggleWishlist = async (productId: string) => {
    if (!session) {
      // Redirect to login or show auth modal
      return
    }
    if (isInWishlist(productId)) {
      // Handle remove from wishlist
    } else {
      await addToWishlist(productId)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">E-Commerce</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-indigo-600">
                Cart
              </Link>
              <Link href="/wishlist" className="text-gray-700 hover:text-indigo-600">
                Wishlist
              </Link>
              {session ? (
                <Link href="/profile" className="text-gray-700 hover:text-indigo-600">
                  Profile
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600">
                    Login
                  </Link>
                  <Link href="/auth/register" className="text-gray-700 hover:text-indigo-600">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Welcome to Our Store
            </h1>
            <p className="mt-6 text-xl sm:text-2xl">
              Discover amazing products with fast delivery across Algeria
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fast Delivery</h3>
              <p className="mt-2 text-gray-600">Delivery to all 58 wilayas across Algeria</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Secure Payment</h3>
              <p className="mt-2 text-gray-600">Multiple payment methods including Stripe, CIB, and Eddahabia</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Wishlist</h3>
              <p className="mt-2 text-gray-600">Save your favorite items for later</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-4 text-lg text-gray-600">Check out our latest and greatest products</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-indigo-600">{product.price.toFixed(2)} DZD</span>
                      <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={!session || product.stockQuantity === 0}
                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        disabled={!session}
                        className={`p-2 rounded-md ${
                          isInWishlist(product.id)
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">E-Commerce</h3>
              <p className="text-gray-400">Your trusted online shopping destination in Algeria.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
                <li><Link href="/wishlist" className="text-gray-400 hover:text-white">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Account</h4>
              <ul className="space-y-2">
                {session ? (
                  <>
                    <li><Link href="/profile" className="text-gray-400 hover:text-white">Profile</Link></li>
                    <li><Link href="/profile/orders" className="text-gray-400 hover:text-white">Orders</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Login</Link></li>
                    <li><Link href="/auth/register" className="text-gray-400 hover:text-white">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 E-Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}