import { Geist as FontSans, Geist_Mono, Urbanist } from "next/font/google"
import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const fontUrban = Urbanist({
  subsets: ["latin"],
  variable: "--font-urban",
})

const fontHeading = localFont({
  src: "./CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

// export const fontGeist = localFont({
//   src: "./GeistVF.woff2",
//   variable: "--font-geist",
// })
// const fontGeist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist",
//   weight: ["400", "500", "600", "700"], // regular, medium, semi-bold, and bold
//   display: "swap",
// })

export const fontVariables = cn(
  fontSans.variable,
  fontUrban.variable,
  fontHeading.variable,
  fontMono.variable
)
