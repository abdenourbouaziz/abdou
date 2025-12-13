import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Check if user is accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    if (token.role !== 'ADMIN') {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}