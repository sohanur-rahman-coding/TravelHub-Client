/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compress: true,
  images: {
    // Enable modern formats for huge savings
    formats: ["image/avif", "image/webp"],
    // Optimize quality vs size
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Reduce JS bundle size
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@heroui/react",
      "swiper",
    ],
  },
};

export default nextConfig;