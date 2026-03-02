import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Check if NEXTAUTH_SECRET is set
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn('NEXTAUTH_SECRET is not set. Please add it to your environment variables.')
    
    // For development, allow access without authentication
    // In production, this should be properly configured
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Skip auth checks in development if secret is missing
    return NextResponse.next()
  }
  
  // Import getToken only when secret is available
  const { getToken } = await import('next-auth/jwt')
  
  // Get token to check authentication and role
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // Define protected routes
  const userRoutes = ['/cart', '/checkout', '/orders']
  const adminRoutes = ['/admin', '/admin/orders', '/admin/products']

  // Check if user is admin
  const isAdmin = token?.role === 'ADMIN'

  // Protect user routes - require authentication
  if (userRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin users should not access user routes
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  // Protect admin routes - require admin role
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
