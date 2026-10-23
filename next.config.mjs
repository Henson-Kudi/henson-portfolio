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
    unoptimized: true,
  },
  // Font files read from disk by the generated-image routes must be traced
  // into those serverless bundles on Vercel.
  outputFileTracingIncludes: {
    "/og/project/[slug]": ["./assets/fonts/**"],
  },
}

export default nextConfig
