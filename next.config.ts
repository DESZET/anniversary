import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["three"],
  allowedDevOrigins: ["192.168.15.1"],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
