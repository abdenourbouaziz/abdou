'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stockQuantity: number
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from API on mount
  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clearAll: true }),
      })

      if (response.ok) {
        setItems([])
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}