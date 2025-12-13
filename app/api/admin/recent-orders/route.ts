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

    const recentOrders = await db.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    const orders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user.name || order.user.email,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Admin recent orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}