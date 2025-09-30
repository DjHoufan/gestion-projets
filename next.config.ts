import type { NextConfig } from "next";

const nextConfig: NextConfig & { allowedDevOrigins?: string[] } = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mrsjolhfnqzmuekkhzde.supabase.co",
        pathname: "/**",
      },
    ],
  },
  experimental: {
   
    serverActions: {
      bodySizeLimit: "5gb", 
    },
  },
 
};

export default nextConfig;
