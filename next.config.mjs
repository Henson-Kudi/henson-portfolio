/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep these out of the bundle: @react-pdf ships native/font assets; the Neon
  // driver + ws have Node-native bits that shouldn't be bundled.
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "ws",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Vercel's optimizer resizes and re-encodes (AVIF/WebP) on the fly.
    // Covers live on R2 and on this site's own /og routes.
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "amahkudi.dev" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Font files read from disk by the generated-image routes must be traced
  // into those serverless bundles on Vercel.
  outputFileTracingIncludes: {
    "/og/project/[slug]": ["./assets/fonts/**"],
  },
}

export default nextConfig
