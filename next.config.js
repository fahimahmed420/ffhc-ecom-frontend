/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',          // must match the URL protocol
        hostname: 'cdn.dummyjson.com', // the domain of your external images
        port: '',                   // leave empty unless using non-standard ports
        pathname: '/**',            // allow all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;