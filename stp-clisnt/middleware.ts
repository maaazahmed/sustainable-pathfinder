import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define which paths are protected (require authentication)
  const isProtectedPath = path.startsWith("/dashboard")

  // Define which paths are auth paths (login, register)
  const isAuthPath = path === "/login" || path === "/register"

  // Check if user is authenticated by looking for the token cookie
  const token = request.cookies.get("token")?.value
  const isAuthenticated = !!token

  // If trying to access a protected route without being authenticated
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access login/register while already authenticated
  if (isAuthPath && isAuthenticated) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except for static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
