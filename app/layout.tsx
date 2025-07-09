import { Viewport } from "next"
import { cookies } from "next/headers"
import { fontVariables } from "@/assets/fonts"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

import { cn, constructMetadata } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ActiveThemeProvider } from "@/components/active-theme"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { VercelAnalytics } from "@/components/analytics/vercel-analytics"

import "@/assets/styles/globals.css"
import Script from "next/script"

interface RootLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export const metadata = constructMetadata()

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />

        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              {children}
              <Toaster position="top-center" richColors closeButton />
              <VercelAnalytics />
              <GoogleAnalytics />
            </ActiveThemeProvider>
          </ThemeProvider>
        </SessionProvider>
        {modal}
      </body>
    </html>
  )
}
