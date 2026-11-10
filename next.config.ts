import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/stock-market', destination: '/share-market', permanent: true },
      { source: '/nse-holidays-2026', destination: '/nse-bse-holidays-2026', permanent: true },
      { source: '/bank-holidays', destination: '/bank-holidays-2026', permanent: false },
    ];
  },
};
export default nextConfig;
