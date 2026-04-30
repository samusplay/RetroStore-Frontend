// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nintendo.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // Para Mario Kart
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net', // Para Street Fighter
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      }
    ],
  },
};

export default nextConfig;