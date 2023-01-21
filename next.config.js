/** @type {import('next').NextConfig} */

const nextConfig = {
  // reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/helpmeprinteth",
        destination: "/helpMePrintETH",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["fafz.mypinata.cloud"],
  },
};

module.exports = nextConfig;
