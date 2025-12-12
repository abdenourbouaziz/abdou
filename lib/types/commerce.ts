// Simplified type definitions for the commerce data layer
// These match the Prisma schema but don't require the generated client

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

export interface Address {
  id: string
  userId: string
  type: string
  firstName: string
  lastName: string
  street: string
  city: string
  wilayaCode: string
  wilayaName: string
  postalCode?: string
  phone?: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
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
  createdBy?: string
  updatedBy?: string
}

export interface ProductCategory {
  id: string
  productId: string
  categoryId: string
  createdAt: Date
}

export interface ProductMedia {
  id: string
  productId: string
  url: string
  alt?: string
  type: string
  order: number
  createdAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku?: string
  price: number
  comparePrice?: number
  attributes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InventoryLevel {
  id: string
  productId: string
  productVariantId?: string
  quantity: number
  reservedQty: number
  lowStockThreshold: number
  createdAt: Date
  updatedAt: Date
}

export interface FlashSale {
  id: string
  name: string
  description?: string
  startTime: Date
  endTime: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FlashSaleItem {
  id: string
  flashSaleId: string
  productId: string
  productVariantId?: string
  discountPrice: number
  maxQuantity: number
  soldQuantity: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  addressId: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productVariantId?: string
  quantity: number
  price: number
  createdAt: Date
}

export interface Payment {
  id: string
  orderId: string
  method: string
  status: string
  amount: number
  transactionId?: string
  paymentData?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Shipment {
  id: string
  orderId: string
  addressId: string
  trackingNumber?: string
  carrier?: string
  status: string
  shippedAt?: Date
  deliveredAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Review {
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
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  productVariantId?: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}