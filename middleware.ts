import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

import { siteConfig } from "./config/site"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // req.auth
  // Apply CORS headers to site.webmanifest
  const response = NextResponse.next()
  if (pathname === "/site.webmanifest") {
    response.headers.set(
      "Access-Control-Allow-Origin",
      `https://*.${siteConfig.domainName}`
    )
    response.headers.set("Access-Control-Allow-Methods", "GET")
    return response
  }

  // Block indexing of screenshot files and dynamic content
  if (pathname.startsWith('/screenshots/') || 
      pathname.includes('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.includes('.png') ||
      pathname.includes('.jpg') ||
      pathname.includes('.jpeg') ||
      pathname.includes('.pdf')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  } else {
    response.headers.set('X-Robots-Tag', 'index, follow');
  }

  // Add security headers for better SEO
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|/site.webmanifest).*)",
  ],
}
