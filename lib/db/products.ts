import { prisma } from './prisma'

// Product types with relations
export interface ProductWithDetails {
  id: string
  name: string
  slug: string
  description?: string
  brand?: string
  sku?: string
  isActive: boolean
  isFeatured: boolean
  weight?: number
  dimensions?: string
  createdAt: Date
  updatedAt: Date
  categories: {
    category: {
      id: string
      name: string
      slug: string
    }
  }[]
  media: {
    id: string
    url: string
    alt: string | null
    type: string
    order: number
  }[]
  variants: any[]
  reviews: {
    rating: number
  }[]
}

// Get featured products
export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      media: {
        orderBy: {
          order: 'asc',
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        include: {
          inventory: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
        where: {
          isPublished: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 12,
  })

  return products
}

// Get product by slug with full details
export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      media: {
        orderBy: {
          order: 'asc',
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        include: {
          inventory: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
        where: {
          isPublished: true,
        },
      },
    },
  })

  return product
}

// Search products
export async function searchProducts(query: string, limit = 20) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      media: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
      variants: {
        where: {
          isActive: true,
        },
        include: {
          inventory: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    take: limit,
    orderBy: [
      {
        isFeatured: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return products
}

// Get flash sale items with remaining stock
export async function getFlashSaleItems() {
  const now = new Date()
  
  const flashSales = await prisma.flashSale.findMany({
    where: {
      isActive: true,
      startTime: {
        lte: now,
      },
      endTime: {
        gte: now,
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              media: {
                orderBy: {
                  order: 'asc',
                },
                take: 1,
              },
              variants: {
                where: {
                  isActive: true,
                },
                include: {
                  inventory: true,
                },
              },
            },
          },
          productVariant: {
            include: {
              inventory: true,
            },
          },
        },
      },
    },
  })

  // Calculate remaining stock for each item
    const itemsWithRemainingStock = flashSales.flatMap((sale: any) =>
      sale.items
        .filter((item: any) => item.soldQuantity < item.maxQuantity)
        .map((item: any) => ({
          ...item,
          remainingStock: item.maxQuantity - item.soldQuantity,
          product: item.product,
          productVariant: item.productVariant,
        }))
    )

  return itemsWithRemainingStock
}

// Decrement flash sale stock atomically
export async function decrementFlashSaleStock(
  flashSaleItemId: string,
  quantity: number
): Promise<boolean> {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      // Get the flash sale item with current sold quantity
      const flashSaleItem = await tx.flashSaleItem.findUnique({
        where: {
          id: flashSaleItemId,
        },
      })

      if (!flashSaleItem) {
        throw new Error('Flash sale item not found')
      }

      // Check if there's enough stock
      const remainingStock = flashSaleItem.maxQuantity - flashSaleItem.soldQuantity
      if (remainingStock < quantity) {
        throw new Error('Insufficient flash sale stock')
      }

      // Update the sold quantity atomically
      await tx.flashSaleItem.update({
        where: {
          id: flashSaleItemId,
        },
        data: {
          soldQuantity: {
            increment: quantity,
          },
        },
      })

      return true
    })

    return result
  } catch (error) {
    console.error('Error decrementing flash sale stock:', error)
    return false
  }
}

// Get product inventory
export async function getProductInventory(productId: string, variantId?: string) {
  const inventory = await prisma.inventoryLevel.findMany({
    where: {
      productId,
      ...(variantId && { productVariantId: variantId }),
    },
    include: {
      product: {
        select: {
          name: true,
        },
      },
      productVariant: {
        select: {
          name: true,
          sku: true,
        },
      },
    },
  })

  return inventory
}

// Get products by category
export async function getProductsByCategory(categorySlug: string, limit = 20) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      },
    },
    include: {
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      media: {
        orderBy: {
          order: 'asc',
        },
        take: 1,
      },
      variants: {
        where: {
          isActive: true,
        },
        include: {
          inventory: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    take: limit,
    orderBy: [
      {
        isFeatured: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return products
}