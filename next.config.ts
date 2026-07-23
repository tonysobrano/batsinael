import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
        port: "",
        pathname: "/portfolio/**",
        search: "",
      },
    ],
    formats: ["image/webp"],
    qualities: [90, 92],
  },
};

export default nextConfig;
