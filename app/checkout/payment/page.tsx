'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useRouter, useSearchParams } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  clientSecret: string
  orderId: string
}

function PaymentForm({ clientSecret, orderId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed')
      } else {
        setMessage('An unexpected error occurred.')
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, update order status
      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        })

        if (response.ok) {
          router.push(`/checkout/success?orderId=${orderId}&paymentIntent=${paymentIntent.id}`)
        } else {
          setMessage('Payment successful but order update failed')
        }
      } catch (error) {
        setMessage('Payment successful but order update failed')
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{message}</div>
        </div>
      )}

      <button
        disabled={loading || !stripe || !elements}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}

export default function StripePaymentPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentIntentId = searchParams.get('paymentIntentId')
    const orderIdParam = searchParams.get('orderId')

    if (paymentIntentId && orderIdParam) {
      setClientSecret(paymentIntentId)
      setOrderId(orderIdParam)
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading payment...</p>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-4">Invalid payment session</p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    )
  }

  const appearance = {
    theme: 'stripe' as const,
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Complete Payment</h1>
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} orderId={orderId} />
          </Elements>
        </div>
      </div>
    </div>
  )
}