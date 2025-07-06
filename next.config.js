/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.openweathermap.org", "tile.openstreetmap.org"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  eslint: {
    // WARNING: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Uncomment the next line if you want to skip TypeScript errors too
    // ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
