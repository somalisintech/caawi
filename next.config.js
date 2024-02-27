const { withAxiom } = require('next-axiom');

/** @type {import("next").NextConfig} */
const nextConfig = {
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
