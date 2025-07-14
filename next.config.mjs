import { withContentCollections } from "@content-collections/next"

const nextConfig = {
  /* config options here */
  // output: "standalone", // for docker deployment
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // optimizeCss: false,
  },
  compiler: {
    styledComponents: true,
    // removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.nestsaas.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.cloudflarestorage.com",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "vercel.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // productionBrowserSourceMaps: true,
}

export default withContentCollections(nextConfig)
