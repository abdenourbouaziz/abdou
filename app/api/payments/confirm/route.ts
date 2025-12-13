import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await req.json()

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      await db.payment.updateMany({
        where: {
          orderId,
          stripePaymentIntentId: paymentIntentId,
        },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      })

      // Update order status
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'CONFIRMED',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed and order updated',
      })
    } else {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}