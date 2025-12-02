import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⛳ Ignore TS errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // 🚫 Skip ESLint during build
  },
};

export default nextConfig;
