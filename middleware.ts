import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

import { siteConfig } from "./config/site"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // req.auth

  // Apply CORS headers to site.webmanifest
  if (pathname === "/site.webmanifest") {
    const response = NextResponse.next()
    response.headers.set(
      "Access-Control-Allow-Origin",
      `https://*.${siteConfig.domainName}`
    )
    response.headers.set("Access-Control-Allow-Methods", "GET")
    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|/site.webmanifest).*)",
  ],
}
