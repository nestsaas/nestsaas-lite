import fs from "fs"
import path from "node:path"
import { NextRequest } from "next/server"
import { allPosts } from "content-collections"

import { siteConfig } from "@/config/site"

function generateBlogHeaderSVG({
  date = "",
  title = "",
  description = "",
} = {}) {
  const textFontSize = 32
  let descriptionTop = 200

  const getTitleLines = (text: string, maxLength = 40) => {
    // If no title provided, return empty array
    if (!text) return []

    const words = text.split(" ")
    const lines = []
    let currentLine: string[] = []
    let currentLength = 0

    words.forEach((word) => {
      // Check if the current line is full or if the word is too long
      if (
        currentLength + word.length + 1 <= maxLength ||
        currentLine.length === 0
      ) {
        currentLine.push(word)
        currentLength += word.length + 1
      } else {
        // Start a new line
        lines.push(currentLine.join(" "))
        currentLine = [word]
        currentLength = word.length
      }
    })

    // Add the last line if there's anything left
    if (currentLine.length > 0) {
      lines.push(currentLine.join(" "))
    }

    return lines
  }

  // push the description down if the title is too long
  if (title.length > 40) {
    descriptionTop = 210
  }

  // Helper function to safely split description into lines
  const getDescriptionLines = (text: string, maxLength = 65) => {
    // If no description provided, return empty array
    if (!text) return []

    const words = text.split(" ")
    const lines = []
    let currentLine: string[] = []
    let currentLength = 0

    words.forEach((word) => {
      if (currentLength + word.length + 1 <= maxLength) {
        currentLine.push(word)
        currentLength += word.length + 1
      } else {
        lines.push(currentLine.join(" "))
        currentLine = [word]
        currentLength = word.length
      }
    })

    if (currentLine.length > 0) {
      lines.push(currentLine.join(" "))
    }

    return lines
  }

  const titleLines = getTitleLines(title)
  const descriptionLines = getDescriptionLines(description)

  return `
<svg viewBox="0 0 800 400" width="100%">
   <defs>
     <style>
        /* Font declarations will be replaced dynamically */
        svg {
          font-family: Inter, sans-serif;
        }
      </style>

    // <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
    //   <stop offset="0%" stop-color="#f8f9fa" />
    //   <stop offset="100%" stop-color="#f1f3f5" />
    // </linearGradient>
    
    <!-- Enhanced visible texture pattern with classic elegant design -->
    <pattern id="texture" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="scale(0.25)">
      <rect width="100%" height="100%" fill="transparent"/>
      
      <!-- Base paper texture -->
      <rect width="120" height="120" fill="#dee2e6" opacity="0.15" />
      
      <!-- Elegant border frame - more visible -->
      <rect x="5" y="5" width="110" height="110" stroke="#6c757d" stroke-width="0.8" fill="none" opacity="0.4" />
      <rect x="10" y="10" width="100" height="100" stroke="#6c757d" stroke-width="0.5" fill="none" opacity="0.35" />
      
      <!-- Enhanced corner flourishes -->
      <path d="M5,5 c10,0 10,10 10,10 M115,5 c-10,0 -10,10 -10,10 M5,115 c10,0 10,-10 10,-10 M115,115 c-10,0 -10,-10 -10,-10" stroke="#495057" stroke-width="0.8" fill="none" opacity="0.45" />
      
      <!-- More visible decorative center medallion -->
      <circle cx="60" cy="60" r="20" fill="none" stroke="#495057" stroke-width="0.6" opacity="0.3" />
      <path d="M60,40 L60,80 M40,60 L80,60 M45,45 L75,75 M45,75 L75,45" stroke="#495057" stroke-width="0.6" opacity="0.3" />
      
      <!-- Enhanced fleur-de-lis elements -->
      <path d="M60,10 c0,5 5,10 5,10 c0,-5 5,-10 5,-10 c0,5 -10,10 -10,10 z" fill="#495057" opacity="0.35" />
      <path d="M60,110 c0,-5 5,-10 5,-10 c0,5 5,10 5,10 c0,-5 -10,-10 -10,-10 z" fill="#495057" opacity="0.35" />
      <path d="M10,60 c5,0 10,5 10,5 c-5,0 -10,5 -10,5 c5,0 10,-10 10,-10 z" fill="#495057" opacity="0.35" />
      <path d="M110,60 c-5,0 -10,5 -10,5 c5,0 10,5 10,5 c-5,0 -10,-10 -10,-10 z" fill="#495057" opacity="0.35" />
    </pattern>
  </defs>

  <!-- Single background rectangle with texture -->
  <rect
    x="0"
    y="0"
    width="800"
    height="400"
    fill="#f8f9fa"
  />
  
  <!-- Full texture overlay -->
  <rect
    x="0"
    y="0"
    width="800"
    height="400"
    fill="url(#texture)"
    opacity="0.85"
  />
  
  <!-- Decorative corner elements - subtle triangular shapes -->
  <path d="M0,0 L60,0 Q40,20 20,40 Q0,60 0,60 Z" fill="#495057" opacity="0.1" />
  <path d="M800,0 L740,0 Q760,20 780,40 Q800,60 800,60 Z" fill="#495057" opacity="0.1" />
  <path d="M0,400 L60,400 Q40,380 20,360 Q0,340 0,340 Z" fill="#495057" opacity="0.1" />
  <path d="M800,400 L740,400 Q760,380 780,360 Q800,340 800,340 Z" fill="#495057" opacity="0.1" />
  

  <!-- Brand watermark element in top right -->
  <g transform="translate(720, 60)" opacity="0.15">
    <!-- Stylized N for NestSaaS -->
    <path d="M0,0 L0,24 L4,24 L16,8 L16,24 L20,24 L20,0 L16,0 L4,16 L4,0 Z" fill="#495057" />
    <!-- Decorative circle -->
    <circle cx="10" cy="12" r="16" stroke="#495057" stroke-width="1" fill="none" />
  </g>

  <!-- Date -->
  <text
    x="60"
    y="80"
    fill="#71717a"
    style="font-family: 'Inter'; font-weight: 400; font-size: 16px; letter-spacing: -0.01em;"
  >${date}</text>

  <!-- Title -->
  <text
    x="60"
    y="140"
    fill="black"
    font-size="${textFontSize}px"
    style="font-family: 'Inter'; font-weight: 600; letter-spacing: -0.02em;"
  >

  ${titleLines.map((line, index) => `<tspan x="60" y="${125 + index * 28}" style="font-family: 'Inter'; font-weight: 600;">${line}</tspan>`).join("\n")}
</text>

  <!-- Description -->
  ${descriptionLines
    .map(
      (line, index) => `
    <text
      x="60"
      y="${descriptionTop + index * 28}"
      fill="#a1a1aa"
      style="font-family: 'Inter'; font-weight: 400; font-size: 18px; letter-spacing: -0.01em;"
    >${line}</text>
  `
    )
    .join("")}

  <!-- Domain name -->
  <text
    x="60"
    y="340"
    fill="#71717a"
    style="font-family: 'Inter'; font-weight: 400; font-size: 16px; letter-spacing: -0.01em;"
  >${siteConfig.domainName}</text>
  
  <!-- Logo placeholder - will be replaced with actual logo -->
  <image
    x="680"
    y="320"
    width="80"
    height="40"
    href="LOGO_PLACEHOLDER"
    preserveAspectRatio="xMidYMid meet"
  />
</svg>`
}

const basePath = path.resolve(process.cwd())
const fontsPath = path.resolve(basePath, "assets/fonts")

const fontConfigPath = path.resolve(fontsPath, "fonts.conf")
// Load the font files
const interRegularPath = path.resolve(fontsPath, "Inter-Regular.ttf")
const interBoldPath = path.resolve(fontsPath, "Inter-Bold.ttf")

// Load the logo file
const logoPath = path.resolve(process.cwd(), "public/logo.png")

// Helper function to read file and convert to base64
async function getFileBase64(filePath: string, mimeType: string) {
  try {
    const buffer = fs.readFileSync(filePath)
    return `data:${mimeType};base64,${buffer.toString("base64")}`
  } catch (error) {
    console.error(`Error loading file from ${filePath}:`, error)
    return null
  }
}

// Helper function specifically for fonts
async function getFontBase64(fontPath: string) {
  return getFileBase64(fontPath, "font/ttf")
}

export const dynamic = "force-dynamic"

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string
    }>
  }
) {
  const slug = (await params).slug
  const item = allPosts.find((post) => post._meta.path === slug)
  if (!item) {
    return new Response("Not found", { status: 404 })
  }

  // Load fonts and logo, convert to base64
  const [interRegularBase64, interBoldBase64, logoBase64] = await Promise.all([
    getFontBase64(interRegularPath),
    getFontBase64(interBoldPath),
    getFileBase64(logoPath, "image/png"),
  ])

  const date = new Date(item.date)
  const dateString = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  process.env.FONTCONFIG_FILE = fontConfigPath
  process.env.FONTCONFIG_PATH = fontsPath

  // Generate SVG with embedded fonts
  let svg = generateBlogHeaderSVG({
    date: dateString,
    title: item.title,
    description: item.description ?? "",
  })

  // Replace the font-face declarations with base64 embedded fonts and add logo
  if (interRegularBase64 && interBoldBase64) {
    // Find the style tag and replace its content
    const styleTagRegex = /<style>([\s\S]*?)<\/style>/
    const fontFaceDeclaration = `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: url("${interRegularBase64}") format('truetype');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          src: url("${interBoldBase64}") format('truetype');
        }
        svg {
          font-family: 'Inter', sans-serif;
        }
      `

    svg = svg.replace(styleTagRegex, `<style>${fontFaceDeclaration}</style>`)

    // Replace logo placeholder with actual base64 logo if available
    if (logoBase64) {
      svg = svg.replace("LOGO_PLACEHOLDER", logoBase64)
    }
  }
  try {
    const { default: sharp } = await import("sharp")
    const image = await sharp(Buffer.from(svg)).webp().toBuffer()
    // Cache for a year
    const cacheTime = 60 * 60 * 24 * 365
    const cacheControl = `public, no-transform, max-age=${cacheTime}, immutable`
    return new Response(image, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": cacheControl,
      },
    })
  } catch (e) {
    console.error(e)
    return new Response(null, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
