'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stockQuantity: number
  }
  createdAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  totalItems: number
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load wishlist from API on mount
  useEffect(() => {
    loadWishlist()
  }, [])

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

  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId)
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}