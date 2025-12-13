'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { algerianWilayas } from '@/lib/wilayas'

interface CheckoutData {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  address1: string
  address2?: string
  city: string
  wilaya: string
  postalCode?: string
  deliveryMethod: string
  paymentMethod: string
  notes?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address1: '',
    city: '',
    wilaya: '',
    deliveryMethod: 'standard',
    paymentMethod: 'stripe',
  })

  const selectedWilaya = algerianWilayas.find(w => w.name === checkoutData.wilaya)
  const deliveryFee = selectedWilaya?.deliveryFee || 0
  const totalWithDelivery = totalAmount + deliveryFee

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1: // Contact info
        return !!(checkoutData.email && checkoutData.firstName && checkoutData.lastName && checkoutData.phoneNumber)
      case 2: // Shipping address
        return !!(checkoutData.address1 && checkoutData.city && checkoutData.wilaya)
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...checkoutData,
          deliveryFee,
          estimatedDays: selectedWilaya?.estimatedDays,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        await clearCart()
        router.push(`/checkout/success?orderId=${data.orderId}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      stepNumber <= step
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        stepNumber < step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Contact</span>
              <span>Shipping</span>
              <span>Delivery</span>
              <span>Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={checkoutData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={checkoutData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={checkoutData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={checkoutData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={checkoutData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={checkoutData.address2 || ''}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={checkoutData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={checkoutData.postalCode || ''}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wilaya *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={checkoutData.wilaya}
                      onChange={(e) => handleInputChange('wilaya', e.target.value)}
                    >
                      <option value="">Select Wilaya</option>
                      {algerianWilayas.map((wilaya) => (
                        <option key={wilaya.id} value={wilaya.name}>
                          {wilaya.code} - {wilaya.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery Method */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={checkoutData.deliveryMethod === 'standard'}
                        onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Standard Delivery</div>
                        <div className="text-sm text-gray-600">
                          {selectedWilaya ? `${selectedWilaya.estimatedDays} business days` : 'Select wilaya first'}
                        </div>
                      </div>
                      <div className="font-medium">
                        {selectedWilaya ? `${deliveryFee} DZD` : '-'}
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Special delivery instructions..."
                      value={checkoutData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={checkoutData.paymentMethod === 'stripe'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cib"
                        checked={checkoutData.paymentMethod === 'cib'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">CIB Online</div>
                        <div className="text-sm text-gray-600">Pay with your CIB account</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="eddahabia"
                        checked={checkoutData.paymentMethod === 'eddahabia'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Eddahabia Card</div>
                        <div className="text-sm text-gray-600">Pay with your Eddahabia card</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={checkoutData.paymentMethod === 'cod'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when your order arrives</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!validateStep(step)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Complete Order - ${totalWithDelivery} DZD`}
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.product.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} DZD
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{totalAmount.toFixed(2)} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{deliveryFee.toFixed(2)} DZD</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{totalWithDelivery.toFixed(2)} DZD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}