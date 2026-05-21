import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@libsql/client",
    "libsql",
    "@prisma/adapter-libsql",
    "@prisma/client",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
