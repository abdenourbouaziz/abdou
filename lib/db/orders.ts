import { prisma } from './prisma'

// Order types with relations
export interface OrderWithDetails {
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
  user: any
  address: {
    id: string
    firstName: string
    lastName: string
    street: string
    city: string
    wilayaCode: string
    wilayaName: string
    postalCode: string | null
    phone: string | null
  }
  items: any[]
  payments: {
    id: string
    method: string
    status: string
    amount: number
    paidAt: Date | null
  }[]
}

// Create a new order
export async function createOrder(orderData: {
  userId: string
  addressId: string
  items: {
    productId: string
    productVariantId?: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  shippingCost?: number
  taxAmount?: number
  discountAmount?: number
  notes?: string
}) {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  const order = await prisma.order.create({
    data: {
      userId: orderData.userId,
      addressId: orderData.addressId,
      orderNumber,
      status: 'pending',
      totalAmount: orderData.totalAmount,
      shippingCost: orderData.shippingCost || 0,
      taxAmount: orderData.taxAmount || 0,
      discountAmount: orderData.discountAmount || 0,
      notes: orderData.notes,
      items: {
        create: orderData.items.map(item => ({
          productId: item.productId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  return order
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      payments: {
        select: {
          id: true,
          method: true,
          status: true,
          amount: true,
          paidAt: true,
        },
      },
    },
  })

  return order
}

// Get order by order number
export async function getOrderByOrderNumber(orderNumber: string): Promise<OrderWithDetails | null> {
  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      payments: {
        select: {
          id: true,
          method: true,
          status: true,
          amount: true,
          paidAt: true,
        },
      },
    },
  })

  return order
}

// Get orders by user ID
export async function getOrdersByUserId(userId: string, limit = 10) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      address: {
        select: {
          city: true,
          wilayaName: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              media: {
                take: 1,
                orderBy: {
                  order: 'asc',
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  return orders
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
      updatedAt: new Date(),
    },
  })

  return order
}

// Create payment for order
export async function createPayment(paymentData: {
  orderId: string
  method: string
  amount: number
  transactionId?: string
  paymentData?: string
}) {
  const payment = await prisma.payment.create({
    data: {
      orderId: paymentData.orderId,
      method: paymentData.method,
      amount: paymentData.amount,
      status: 'pending',
      transactionId: paymentData.transactionId,
      paymentData: paymentData.paymentData,
    },
  })

  return payment
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  paidAt?: Date
) {
  const payment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status,
      paidAt: paidAt || (status === 'completed' ? new Date() : null),
      updatedAt: new Date(),
    },
  })

  return payment
}

// Create shipment
export async function createShipment(shipmentData: {
  orderId: string
  addressId: string
  trackingNumber?: string
  carrier?: string
  status?: string
}) {
  const shipment = await prisma.shipment.create({
    data: {
      orderId: shipmentData.orderId,
      addressId: shipmentData.addressId,
      trackingNumber: shipmentData.trackingNumber,
      carrier: shipmentData.carrier,
      status: shipmentData.status || 'preparing',
      createdAt: new Date(),
    },
    include: {
      order: true,
      address: true,
    },
  })

  return shipment
}

// Update shipment status
export async function updateShipmentStatus(
  shipmentId: string,
  status: string,
  shippedAt?: Date,
  deliveredAt?: Date
) {
  const shipment = await prisma.shipment.update({
    where: {
      id: shipmentId,
    },
    data: {
      status,
      shippedAt: shippedAt || (status === 'shipped' ? new Date() : null),
      deliveredAt: deliveredAt || (status === 'delivered' ? new Date() : null),
      updatedAt: new Date(),
    },
  })

  return shipment
}

// Calculate order totals
export function calculateOrderTotals(items: {
  price: number
  quantity: number
}[], shippingCost = 0, taxRate = 0.19) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxAmount = subtotal * taxRate
  const total = subtotal + shippingCost + taxAmount

  return {
    subtotal,
    taxAmount,
    shippingCost,
    total,
  }
}