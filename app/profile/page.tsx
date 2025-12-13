'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  name: string
  email: string
  phoneNumber?: string
  role: string
  flashSaleSub: boolean
}

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  estimatedDays: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user) {
      loadUserData()
    }
  }, [status, session, router])

  const loadUserData = async () => {
    try {
      // Load user profile
      const profileResponse = await fetch('/api/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData.user)
      }

      // Load user orders
      const ordersResponse = await fetch('/api/orders')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFlashSaleToggle = async () => {
    try {
      const response = await fetch('/api/profile/flash-sale', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashSaleSub: !profile?.flashSaleSub,
        }),
      })

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, flashSaleSub: !prev.flashSaleSub } : null)
      }
    } catch (error) {
      console.error('Failed to update flash sale subscription:', error)
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name || session.user.name}!
          </h1>
          <p className="text-gray-600">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'addresses'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'wishlist'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Wishlist
              </button>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="block w-full text-left px-4 py-2 rounded-md text-red-700 hover:bg-red-50"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile?.role}
                    </span>
                  </div>
                  
                  {/* Flash Sale Subscription */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Flash Sale Notifications</h3>
                      <p className="text-sm text-gray-600">Get notified about flash sales and special offers</p>
                    </div>
                    <button
                      onClick={handleFlashSaleToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        profile?.flashSaleSub ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          profile?.flashSaleSub ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Order History</h2>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <Link
                        href="/"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{order.totalAmount.toFixed(2)} DZD</p>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Estimated delivery: {order.estimatedDays} days
                            </span>
                            <Link
                              href={`/profile/orders/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Address Book</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Add Address
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Address book management coming soon...</p>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Wishlist</h2>
                </div>
                <div className="p-6">
                  <Link
                    href="/wishlist"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Wishlist →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}