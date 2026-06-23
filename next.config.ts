import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import { sanity } from 'next-sanity/live/cache-life';

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Sanity Live revalidates cached data on-demand (webhooks in production,
  // `router.refresh()` in draft mode), so the default 15-minute time-based
  // revalidation is too aggressive. The `sanity` preset is also applied
  // automatically inside `sanityFetch`; setting it as the default covers any
  // other `'use cache'` boundaries in the app.
  cacheLife: { default: sanity },
  experimental: {
    prefetchInlining: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
