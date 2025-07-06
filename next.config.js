/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.openweathermap.org", "tile.openstreetmap.org"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
