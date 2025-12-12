'use server'

import { 
  getFeaturedProducts, 
  getProductBySlug, 
  searchProducts, 
  getFlashSaleItems,
  decrementFlashSaleStock,
  getProductsByCategory
} from '@/lib/db/products'
import { 
  getReviewEligibility, 
  createReview, 
  getProductReviews,
  getProductReviewStats
} from '@/lib/db/reviews'

// Product server actions
export async function getFeaturedProductsAction() {
  try {
    const products = await getFeaturedProducts()
    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return { success: false, error: 'Failed to fetch featured products' }
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const product = await getProductBySlug(slug)
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    return { success: true, data: product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function searchProductsAction(query: string, limit = 20) {
  try {
    if (!query.trim()) {
      return { success: true, data: [] }
    }
    
    const products = await searchProducts(query, limit)
    return { success: true, data: products }
  } catch (error) {
    console.error('Error searching products:', error)
    return { success: false, error: 'Search failed' }
  }
}

export async function getFlashSaleItemsAction() {
  try {
    const flashSaleItems = await getFlashSaleItems()
    return { success: true, data: flashSaleItems }
  } catch (error) {
    console.error('Error fetching flash sale items:', error)
    return { success: false, error: 'Failed to fetch flash sale items' }
  }
}

export async function getProductsByCategoryAction(categorySlug: string, limit = 20) {
  try {
    const products = await getProductsByCategory(categorySlug, limit)
    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
}

// Flash sale actions
export async function decrementFlashSaleStockAction(flashSaleItemId: string, quantity: number) {
  try {
    const result = await decrementFlashSaleStock(flashSaleItemId, quantity)
    if (result) {
      return { success: true, message: 'Stock decremented successfully' }
    } else {
      return { success: false, error: 'Failed to decrement stock' }
    }
  } catch (error) {
    console.error('Error decrementing flash sale stock:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Stock operation failed' }
  }
}

// Review server actions
export async function getReviewEligibilityAction(userId: string, productId: string) {
  try {
    const eligibility = await getReviewEligibility(userId, productId)
    return { success: true, data: eligibility }
  } catch (error) {
    console.error('Error checking review eligibility:', error)
    return { success: false, error: 'Failed to check review eligibility' }
  }
}

export async function createReviewAction(reviewData: {
  userId: string
  productId: string
  orderItemId: string
  rating: number
  title?: string
  comment?: string
}) {
  try {
    const review = await createReview(reviewData)
    return { success: true, data: review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create review' 
    }
  }
}

export async function getProductReviewsAction(productId: string, limit = 10, offset = 0) {
  try {
    const reviews = await getProductReviews(productId, limit, offset)
    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return { success: false, error: 'Failed to fetch reviews' }
  }
}

export async function getProductReviewStatsAction(productId: string) {
  try {
    const stats = await getProductReviewStats(productId)
    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return { success: false, error: 'Failed to fetch review stats' }
  }
}