import { withSentryConfig } from '@sentry/nextjs';
import { withAxiom } from 'next-axiom';

/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: import.meta.dirname,
  headers: async () => [
    {
      source: '/:path*',
      headers: [{ key: 'Document-Policy', value: 'js-profiling' }]
    }
  ],
  rewrites: async () => [
    {
      source: '/dashboard',
      destination: '/dashboard/mentors'
    }
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ionic.io'
      }
    ]
  }
};

export default withSentryConfig(withAxiom(nextConfig), {
  org: 'somalisintech',
  project: 'caawi',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true
    }
  }
});
