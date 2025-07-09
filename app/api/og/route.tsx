import fs from "fs"
import path from "node:path"
import { NextRequest } from "next/server"

import { siteConfig } from "@/config/site"
import { ogImageSchema } from "@/lib/validations/og"

// eg： /og?heading=NestSaaS&description=The%20ultimate%20SaaS%20starter%20kit&mode=dark

// Set paths for fonts and logo
const basePath = path.resolve(process.cwd())
const fontsPath = path.resolve(basePath, "assets/fonts")

const fontConfigPath = path.resolve(fontsPath, "fonts.conf")
// Load the font files
const interRegularPath = path.resolve(fontsPath, "Inter-Regular.ttf")
const interBoldPath = path.resolve(fontsPath, "Inter-Bold.ttf")

// Load the logo file
const logoPath = path.resolve(process.cwd(), "public/logo.png")

// GitHub avatar path - you may need to download this or use a different path
const githubAvatarPath = path.resolve(
  process.cwd(),
  "public/avatars/shawnhacks.jpg"
)

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

// Function to generate SVG for OG image
function generateOgImageSVG({
  heading = "",
  type = "",
  description = "",
  mode = "dark",
}) {
  // Determine colors based on mode
  const backgroundColor = mode === "dark" ? "#111827" : "#f8f9fa"
  const textColor = mode === "dark" ? "#ffffff" : "#000000"
  const subtleColor =
    mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"
  const subtlerColor =
    mode === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
  const accentColor = mode === "dark" ? "#6366f1" : "#4f46e5"
  const decorColor = mode === "dark" ? "#4b5563" : "#6c757d"

  // Helper function to split text into lines
  const getTitleLines = (text: string, maxLength = 40) => {
    if (!text) return []

    const words = text.split(" ")
    const lines = []
    let currentLine: string[] = []
    let currentLength = 0

    words.forEach((word) => {
      if (
        currentLength + word.length + 1 <= maxLength ||
        currentLine.length === 0
      ) {
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

  // Helper function for description lines
  const getDescriptionLines = (text: string, maxLength = 65) => {
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

  const titleLines = getTitleLines(heading)
  const descriptionLines = getDescriptionLines(description)
  let descriptionTop = 200

  // Push the description down if the title is too long
  if (heading.length > 40) {
    descriptionTop = 210
  }

  return `
<svg viewBox="0 0 1200 630" width="100%">
   <defs>
     <style>
        /* Font declarations will be replaced dynamically */
        svg {
          font-family: Inter, sans-serif;
        }
      </style>
    
    <!-- Enhanced visible texture pattern with classic elegant design -->
    <pattern id="texture" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="scale(0.25)">
      <rect width="100%" height="100%" fill="transparent"/>
      
      <!-- Base paper texture -->
      <rect width="120" height="120" fill="${mode === "dark" ? "#1f2937" : "#dee2e6"}" opacity="0.15" />
      
      <!-- Elegant border frame - more visible -->
      <rect x="5" y="5" width="110" height="110" stroke="${decorColor}" stroke-width="0.8" fill="none" opacity="0.4" />
      <rect x="10" y="10" width="100" height="100" stroke="${decorColor}" stroke-width="0.5" fill="none" opacity="0.35" />
      
      <!-- Enhanced corner flourishes -->
      <path d="M5,5 c10,0 10,10 10,10 M115,5 c-10,0 -10,10 -10,10 M5,115 c10,0 10,-10 10,-10 M115,115 c-10,0 -10,-10 -10,-10" stroke="${decorColor}" stroke-width="0.8" fill="none" opacity="0.45" />
      
      <!-- More visible decorative center medallion -->
      <circle cx="60" cy="60" r="20" fill="none" stroke="${decorColor}" stroke-width="0.6" opacity="0.3" />
      <path d="M60,40 L60,80 M40,60 L80,60 M45,45 L75,75 M45,75 L75,45" stroke="${decorColor}" stroke-width="0.6" opacity="0.3" />
    </pattern>
  </defs>
  
  <!-- Background with texture -->
  <rect width="1200" height="630" fill="${backgroundColor}" />
  <rect width="1200" height="630" fill="url(#texture)" opacity="0.85" />

  <!-- Logo placeholder - will be replaced with actual logo -->
  <image
    x="600"
    y="180"
    width="120"
    height="60"
    href="LOGO_PLACEHOLDER"
    preserveAspectRatio="xMidYMid meet"
    transform="translate(-60, 0)"
  />

  <!-- Type label above heading (centered) -->
  ${type ? `<text x="600" y="270" fill="${subtlerColor}" style="font-family: 'Inter'; font-weight: 400; font-size: 24px; letter-spacing: 0.05em; text-transform: uppercase; text-anchor: middle;">${type}</text>` : ""}

  <!-- Title (centered) -->
  ${titleLines
    .map(
      (line, index) => `
    <text
      x="600"
      y="${310 + index * 60}"
      fill="${textColor}"
      style="font-family: 'Inter'; font-weight: 700; font-size: 52px; letter-spacing: -0.02em; text-anchor: middle;"
    >${line}</text>
  `
    )
    .join("")}

  <!-- Description (centered) -->
  ${descriptionLines
    .map(
      (line, index) => `
    <text
      x="600"
      y="${340 + titleLines.length * 60 + index * 36}"
      fill="${subtleColor}"
      style="font-family: 'Inter'; font-weight: 400; font-size: 28px; letter-spacing: -0.01em; text-anchor: middle;"
    >${line}</text>
  `
    )
    .join("")}

  <!-- Define a circular clip path for the avatar -->
  <defs>
    <clipPath id="avatarCircle">
      <circle cx="100" cy="570" r="20" />
    </clipPath>
  </defs>
  
  <!-- GitHub avatar (circular), username and role (left bottom) -->
  <image
    x="80"
    y="550"
    width="40"
    height="40"
    href="GITHUB_AVATAR_PLACEHOLDER"
    preserveAspectRatio="xMidYMid meet"
    clip-path="url(#avatarCircle)"
  />
  <text
    x="130"
    y="565"
    fill="${textColor}"
    style="font-family: 'Inter'; font-weight: 600; font-size: 18px; letter-spacing: -0.01em;"
  >ShawnHacks</text>
  <text
    x="130"
    y="585"
    fill="${subtlerColor}"
    style="font-family: 'Inter'; font-weight: 400; font-size: 16px; letter-spacing: -0.01em;"
  >NestSaaS Founder</text>
  
  <!-- URL (right bottom) -->
  <text
    x="1120"
    y="570"
    fill="${subtlerColor}"
    style="font-family: 'Inter'; font-weight: 400; font-size: 18px; letter-spacing: -0.01em; text-anchor: end;"
  >${siteConfig.url}</text>
</svg>`
}

// Set dynamic to ensure we generate fresh images
export const dynamic = "force-dynamic"

// /api/og?heading=NestSaaS&mode=dark&type=Blog&description=Optional description
export async function GET(req: NextRequest) {
  try {
    // Extract the search parameters
    const { searchParams } = new URL(req.url)

    // Parse the search parameters using zod schema
    const {
      heading,
      type = "",
      mode,
      description,
    } = ogImageSchema.parse({
      heading: searchParams.get("heading"),
      type: searchParams.get("type") ?? "",
      mode: searchParams.get("mode") ?? "dark",
      description: searchParams.get("description"),
    })

    // Load fonts
    let interRegularData: Buffer
    let interBoldData: Buffer

    try {
      interRegularData = fs.readFileSync(interRegularPath)
      interBoldData = fs.readFileSync(interBoldPath)
    } catch (error: any) {
      console.error("Failed to load font files:", error.message)
      return new Response(`Failed to load font files: ${error.message}`, {
        status: 500,
      })
    }

    // Load fonts, logo, and GitHub avatar, convert to base64
    const [
      interRegularBase64,
      interBoldBase64,
      logoBase64,
      githubAvatarBase64,
    ] = await Promise.all([
      getFontBase64(interRegularPath),
      getFontBase64(interBoldPath),
      getFileBase64(logoPath, "image/png"),
      getFileBase64(githubAvatarPath, "image/jpeg").catch(() => null), // Fallback if avatar not found
    ])

    process.env.FONTCONFIG_FILE = fontConfigPath
    process.env.FONTCONFIG_PATH = fontsPath

    // Generate SVG with embedded fonts
    let svg = generateOgImageSVG({
      heading,
      type,
      description: description ?? "",
      mode,
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
          font-weight: 700;
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

      // Replace GitHub avatar placeholder with actual base64 avatar if available
      if (githubAvatarBase64) {
        svg = svg.replace("GITHUB_AVATAR_PLACEHOLDER", githubAvatarBase64)
      }
    }

    try {
      // Convert SVG to WebP using Sharp
      const { default: sharp } = await import("sharp")
      const image = await sharp(Buffer.from(svg)).webp().toBuffer()

      // Cache for a long time (1 year)
      const cacheTime = 60 * 60 * 24 * 365
      const cacheControl = `public, no-transform, max-age=${cacheTime}, immutable`

      return new Response(image, {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": cacheControl,
        },
      })
    } catch (error: any) {
      console.error("Error generating image:", error.message)
      return new Response(`Failed to generate image: ${error.message}`, {
        status: 500,
      })
    }
  } catch (error: any) {
    console.error("Error parsing request:", error.message)
    return new Response(`Failed to parse request: ${error.message}`, {
      status: 400,
    })
  }
}
