import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure cross-platform compatibility
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optimize for Windows file system
  webpack: (config, { dev, isServer }) => {
    // Ensure consistent behavior across platforms
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
