import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // proxy /api 
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
