import { prisma } from './prisma'

// Review types with relations
export interface ReviewWithDetails {
  id: string
  userId: string
  productId: string
  orderItemId: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    firstName: string
    lastName: string
  }
  product: {
    id: string
    name: string
    slug: string
    media: {
      url: string
      alt: string | null
    }[]
  }
  orderItem: any
}

// Get reviews for a product
export async function getProductReviews(productId: string, limit = 10, offset = 0) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isPublished: true,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })

  return reviews
}

// Get review eligibility for a user and product
export async function getReviewEligibility(userId: string, productId: string) {
  // Check if user has purchased the product and the order is delivered
  const eligibleOrderItems = await prisma.orderItem.findMany({
    where: {
      productId,
      order: {
        userId,
        status: 'delivered',
      },
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
        },
      },
      reviews: {
        select: {
          id: true,
        },
      },
    },
  })

  // Filter out items that already have reviews
  const eligibleItems = eligibleOrderItems.filter(item => item.reviews.length === 0)

  return {
    eligible: eligibleItems.length > 0,
    eligibleItems: eligibleItems.map(item => ({
      orderItemId: item.id,
      orderId: item.orderId,
      orderNumber: item.order.orderNumber,
      quantity: item.quantity,
      price: item.price,
      purchasedAt: item.createdAt,
    })),
  }
}

// Create a new review (only for verified purchases)
export async function createReview(reviewData: {
  userId: string
  productId: string
  orderItemId: string
  rating: number
  title?: string
  comment?: string
}) {
  // First verify eligibility
  const eligibility = await getReviewEligibility(reviewData.userId, reviewData.productId)
  
  if (!eligibility.eligible) {
    throw new Error('User is not eligible to review this product')
  }

  // Check if the orderItemId is in the eligible items
  const eligibleItem = eligibility.eligibleItems.find(item => item.orderItemId === reviewData.orderItemId)
  if (!eligibleItem) {
    throw new Error('Invalid order item for review')
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      userId: reviewData.userId,
      productId: reviewData.productId,
      orderItemId: reviewData.orderItemId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      isVerified: true, // Since we're only allowing reviews from delivered orders
      isPublished: true,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          media: {
            take: 1,
            orderBy: {
              order: 'asc',
            },
          },
        },
      },
    },
  })

  return review
}

// Get product review statistics
export async function getProductReviewStats(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      isPublished: true,
    },
    select: {
      rating: true,
    },
  })

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0

  // Rating distribution
  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }

  reviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    ratingDistribution,
  }
}

// Get all reviews with filters
export async function getReviews(filters: {
  productId?: string
  userId?: string
  rating?: number
  isVerified?: boolean
  isPublished?: boolean
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = {}

  if (filters.productId) where.productId = filters.productId
  if (filters.userId) where.userId = filters.userId
  if (filters.rating) where.rating = filters.rating
  if (filters.isVerified !== undefined) where.isVerified = filters.isVerified
  if (filters.isPublished !== undefined) where.isPublished = filters.isPublished

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      orderItem: {
        select: {
          order: {
            select: {
              orderNumber: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: filters.limit || 20,
    skip: filters.offset || 0,
  })

  return reviews
}

// Update review (only by the author)
export async function updateReview(
  reviewId: string,
  userId: string,
  updateData: {
    rating?: number
    title?: string
    comment?: string
    isPublished?: boolean
  }
) {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized: Can only edit your own reviews')
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  return updatedReview
}

// Delete review (only by the author)
export async function deleteReview(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  if (review.userId !== userId) {
    throw new Error('Unauthorized: Can only delete your own reviews')
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  })

  return { success: true }
}