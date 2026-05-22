import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any https image host (Cloudinary uploads, Unsplash, etc.).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
