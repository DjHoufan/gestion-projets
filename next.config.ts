import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // Allow all paths
      },

      {
        protocol: "https",
        hostname: "mrsjolhfnqzmuekkhzde.supabase.co",
        pathname: "/**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
