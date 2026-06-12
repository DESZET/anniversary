import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["three"],
  allowedDevOrigins: ["192.168.15.1"],

  // Headers untuk video streaming di mobile (range requests)
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
      {
        source: "/music/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
      {
        source: "/photos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
