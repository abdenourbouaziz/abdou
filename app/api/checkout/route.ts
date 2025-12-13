import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateDeliveryFee } from '@/lib/wilayas'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      address1,
      address2,
      city,
      wilaya,
      postalCode,
      deliveryMethod,
      paymentMethod,
      notes,
      deliveryFee,
      estimatedDays,
      items,
    } = await req.json()

    // Validate required fields
    if (!email || !firstName || !lastName || !phoneNumber || !address1 || !city || !wilaya || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate items and calculate totals
    let subtotalAmount = 0
    const validatedItems = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || product.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or not available` },
          { status: 400 }
        )
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = Number(product.price) * item.quantity
      subtotalAmount += itemTotal

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
        total: itemTotal,
      })
    }

    const totalAmount = subtotalAmount + (deliveryFee || 0)

    // Create or update shipping address
    let shippingAddress = await db.address.findFirst({
      where: {
        userId: session.user.id,
        firstName,
        lastName,
        address1,
        city,
        wilaya,
      },
    })

    if (!shippingAddress) {
      shippingAddress = await db.address.create({
        data: {
          userId: session.user.id,
          type: 'both',
          firstName,
          lastName,
          address1,
          address2,
          city,
          postalCode,
          wilaya,
          phoneNumber,
          isDefault: false,
        },
      })
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        totalAmount,
        subtotalAmount,
        shippingAmount: deliveryFee || 0,
        shippingAddressId: shippingAddress.id,
        billingAddressId: shippingAddress.id,
        deliveryMethod,
        wilaya,
        deliveryFee: deliveryFee || 0,
        estimatedDays,
        notes,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'cod' ? 'COMPLETED' : 'PENDING',
        paymentMethod: paymentMethod === 'cod' ? 'cod' : undefined,
      },
    })

    // Create order items
    await db.orderItem.createMany({
      data: validatedItems.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    })

    // Update product stock
    for (const item of validatedItems) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Handle different payment methods
    if (paymentMethod === 'cod') {
      // For cash on delivery, create payment record and complete order
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: 'cod',
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      })

      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
        },
      })
    } else if (paymentMethod === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'dzd',
        metadata: {
          orderId: order.id,
          orderNumber,
          userId: session.user.id,
        },
      })

      // Create payment record
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: 'stripe',
          status: 'PENDING',
          stripePaymentIntentId: paymentIntent.id,
        },
      })

      await db.order.update({
        where: { id: order.id },
        data: {
          stripePaymentId: paymentIntent.id,
          paymentStatus: 'PROCESSING',
        },
      })

      return NextResponse.json({
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        orderNumber,
      })
    } else {
      // For other payment methods (CIB, Eddahabia), we'll handle these later
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          method: paymentMethod,
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      totalAmount,
      paymentMethod,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}