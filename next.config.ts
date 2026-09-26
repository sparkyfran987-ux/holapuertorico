import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eavttymmzrtcwboxhjwl.supabase.co",
        pathname: "/storage/v1/object/public/news-images/**",
      },
    ],
  },
};

export default nextConfig;