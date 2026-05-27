import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
