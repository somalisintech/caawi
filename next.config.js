const { withAxiom } = require('next-axiom');

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
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

module.exports = withAxiom(nextConfig);
