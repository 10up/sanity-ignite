import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Uncomment those lines if you want to log the full url and information about whether it was a acche HIT or MISS for each fetch request in Nextjs
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
