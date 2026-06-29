import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import { sanity } from 'next-sanity/live/cache-life';

// Advertise machine-readable resources on every response via the HTTP `Link`
// header (RFC 8288), using IANA-registered relation types. This lets agents
// discover them without parsing HTML, and it works on non-HTML responses too.
// Config (the platform layer) is the right home for this, per
// https://specification.website/spec/agent-readiness/link-headers/.
const DISCOVERY_LINK = [
  '</llms.txt>; rel="describedby"; type="text/markdown"; title="Site index for LLMs"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</feed.xml>; rel="alternate"; type="application/rss+xml"; title="RSS feed"',
  '</feed.json>; rel="alternate"; type="application/feed+json"; title="JSON feed"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
].join(', ');

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        // Skip Next.js internals; advertise discovery links everywhere else.
        source: '/:path((?!_next/).*)',
        headers: [{ key: 'Link', value: DISCOVERY_LINK }],
      },
    ];
  },
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
