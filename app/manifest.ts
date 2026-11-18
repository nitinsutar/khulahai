import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Khula Hai',
    short_name: 'Khula Hai',
    description: 'Is the bank, share market or post office open today? Live status for your city from RBI, NSE/BSE and government holiday lists.',
    start_url: '/',
    display: 'browser',
    background_color: '#F4F4F1',
    theme_color: '#0B7A45',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
