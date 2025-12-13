import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate comprehensive stats
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      db.order.count(),
      db.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      db.user.count({
        where: { role: 'USER' },
      }),
      db.product.count(),
      db.order.count({
        where: { status: { in: ['PENDING', 'CONFIRMED'] } },
      }),
      db.product.count({
        where: {
          stockQuantity: { lte: 5 },
          status: 'ACTIVE',
        },
      }),
    ])

    // Calculate conversion rate (simplified)
    const totalSessions = 1000 // This would come from analytics
    const conversionRate = totalOrders > 0 ? (totalOrders / totalSessions) * 100 : 0

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? 
      (totalRevenue._sum.totalAmount || 0) / totalOrders : 0

    const stats = {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      conversionRate,
      averageOrderValue,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}