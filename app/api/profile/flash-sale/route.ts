import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { flashSaleSub } = await req.json()

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        flashSaleSub: Boolean(flashSaleSub),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        flashSaleSub: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ 
      user, 
      message: `Flash sale notifications ${flashSaleSub ? 'enabled' : 'disabled'}` 
    })
  } catch (error) {
    console.error('Flash sale subscription PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}