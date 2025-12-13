'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { useSession } from 'next-auth/react'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stockQuantity: number
    description?: string
  }
  createdAt: string
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      loadWishlist()
    }
  }, [session])

  const loadWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1)
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(prev => prev.filter(item => item.productId !== productId))
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your wishlist</p>
          <Link
            href="/auth/login"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">{items.length} items in your wishlist</p>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Start browsing and save your favorite items</p>
              <Link
                href="/"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-indigo-600">
                          {item.product.price.toFixed(2)} DZD
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {item.product.stockQuantity}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(item.productId)}
                          disabled={item.product.stockQuantity === 0}
                          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          className="p-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}