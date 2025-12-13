'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  subtotalAmount: number
  shippingAmount: number
  taxAmount: number
  createdAt: string
  estimatedDays: number
  deliveryMethod: string
  trackingNumber?: string
  notes?: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    wilaya: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }>
  payment: {
    method: string
    status: string
    processedAt?: string
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = params.id as string

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user && orderId) {
      loadOrderDetails()
    }
  }, [status, session, orderId, router]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.order)
      } else if (response.status === 404) {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Failed to load order details:', error)
      router.push('/profile')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusTimeline = (status: string) => {
    const timeline = [
      { status: 'PENDING', label: 'Order Placed', completed: true },
      { status: 'CONFIRMED', label: 'Order Confirmed', completed: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
      { status: 'PROCESSING', label: 'Processing', completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
      { status: 'SHIPPED', label: 'Shipped', completed: ['SHIPPED', 'DELIVERED'].includes(status) },
      { status: 'DELIVERED', label: 'Delivered', completed: status === 'DELIVERED' },
    ]
    return timeline
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link
            href="/profile"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Profile
          </Link>
        </div>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order {orderDetails.orderNumber}</h1>
                <p className="text-gray-600">
                  Placed on {new Date(orderDetails.createdAt).toLocaleDateString()} at{' '}
                  {new Date(orderDetails.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(orderDetails.status)}`}>
                  {orderDetails.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Total Amount</h3>
                <p className="text-xl font-bold">{orderDetails.totalAmount.toFixed(2)} DZD</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Payment Status</h3>
                <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
                  {orderDetails.paymentStatus}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Delivery Method</h3>
                <p className="capitalize">{orderDetails.deliveryMethod}</p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="space-y-4">
              {getStatusTimeline(orderDetails.status).map((item, index) => (
                <div key={item.status} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    item.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.completed ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`ml-3 ${item.completed ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
              <p>{orderDetails.shippingAddress.address1}</p>
              {orderDetails.shippingAddress.address2 && <p>{orderDetails.shippingAddress.address2}</p>}
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.wilaya}</p>
              <p className="mt-2">Estimated delivery: {orderDetails.estimatedDays} business days</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orderDetails.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.total.toFixed(2)} DZD</p>
                      <p className="text-sm text-gray-600">{item.price.toFixed(2)} DZD each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{orderDetails.subtotalAmount.toFixed(2)} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{orderDetails.shippingAmount.toFixed(2)} DZD</span>
                  </div>
                  {orderDetails.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{orderDetails.taxAmount.toFixed(2)} DZD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{orderDetails.totalAmount.toFixed(2)} DZD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {orderDetails.payment && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Payment Method</h3>
                  <p className="text-gray-600 capitalize">{orderDetails.payment.method}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Payment Status</h3>
                  <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(orderDetails.payment.status)}`}>
                    {orderDetails.payment.status}
                  </span>
                </div>
                {orderDetails.payment.processedAt && (
                  <div>
                    <h3 className="font-medium text-gray-900">Processed At</h3>
                    <p className="text-gray-600">
                      {new Date(orderDetails.payment.processedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tracking Information */}
          {orderDetails.trackingNumber && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Tracking Information</h2>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div>
                  <h3 className="font-medium">Tracking Number</h3>
                  <p className="text-gray-600 font-mono">{orderDetails.trackingNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {orderDetails.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Notes</h2>
              <p className="text-gray-600">{orderDetails.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}