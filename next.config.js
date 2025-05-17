const { withAxiom } = require('next-axiom');

/** @type {import("next").NextConfig} */
const nextConfig = {
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
    ],
    domains: [
      'lh3.googleusercontent.com'
      // add other allowed domains here if needed
    ]
  }
};

module.exports = withAxiom(nextConfig);
