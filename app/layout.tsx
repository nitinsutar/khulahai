import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Mukta } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' });
const mukta = Mukta({ subsets: ['devanagari', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-mukta', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Khula Hai',
  title: { default: 'Is the bank open today? Bank holiday today in India | Khula Hai', template: '%s | Khula Hai' },
  description: 'Is the bank, share market or post office open today? Live status for your city from RBI, NSE/BSE and government holiday lists.',
  openGraph: { siteName: 'Khula Hai', type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
  verification: { google: 'MipxCIwtdwHvb139zN1BSGWMVtNoZbG05cIRUtJAk2w' },
};
export const viewport: Viewport = { themeColor: '#F4F4F1', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable} ${mukta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
