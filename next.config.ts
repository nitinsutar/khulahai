import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/share-market', destination: '/is-share-market-open-today', permanent: true },
      { source: '/is-bank-open-today', destination: '/bank-holiday-today', permanent: true },
      { source: '/stock-market', destination: '/is-share-market-open-today', permanent: true },
      { source: '/nse-holidays-2026', destination: '/nse-bse-holidays-2026', permanent: true },
      { source: '/bank-holidays', destination: '/bank-holidays-2026', permanent: false },
    ];
  },
};
export default nextConfig;
