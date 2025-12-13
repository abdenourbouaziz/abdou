import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await db.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
          },
        },
      },
    })

    return NextResponse.json({
      items: cartItems,
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and is in stock
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Product not found or not available' },
        { status: 404 }
      )
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      // Create new cart item
      await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
        },
      })
    }

    // Get updated cart
    const cartItems = await db.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
          },
        },
      },
    })

    return NextResponse.json({
      items: cartItems,
      message: 'Item added to cart',
    })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      await db.cartItem.delete({
        where: { id: existingItem.id },
      })
    } else {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      })
    }

    // Get updated cart
    const cartItems = await db.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
          },
        },
      },
    })

    return NextResponse.json({
      items: cartItems,
    })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const body = await req.json()
    const clearAll = body.clearAll

    if (clearAll) {
      // Clear entire cart
      await db.cartItem.deleteMany({
        where: {
          userId: session.user.id,
        },
      })
    } else if (productId) {
      // Remove specific item
      await db.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          productId,
        },
      })
    } else {
      return NextResponse.json(
        { error: 'Product ID is required or use clearAll flag' },
        { status: 400 }
      )
    }

    // Get updated cart
    const cartItems = await db.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stockQuantity: true,
          },
        },
      },
    })

    return NextResponse.json({
      items: cartItems,
    })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}