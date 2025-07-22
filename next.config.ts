import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'static.wikia.nocookie.net',
      'example.com'
    ],
  },
};

export default nextConfig;
