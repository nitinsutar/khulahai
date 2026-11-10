import { headers } from 'next/headers';
import { Page } from '@/components/page';
import { HomeView } from '@/components/home';
import { cityBySlug } from '@/lib/places';
import { todayIST } from '@/lib/date';
import { cityFromHeader } from '@/lib/geo';
import { meta } from '@/lib/meta';
import { JsonLd } from '@/components/ui';
import { abs } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata = meta({
  title: 'Khula Hai — Bank, Share Market & Post Office: Open Today? (India)',
  description: 'Is the bank open today or not? See bank holiday today in your city, NSE/BSE share market status and post office timings — checked against RBI, NSE/BSE and India Post lists.',
  path: '/', en: '/', hi: '/hi',
  og: { t: 'Is it open today?', s: 'Banks · Share market · Post office' },
});

export default async function Home() {
  const h = await headers();
  const slug = cityFromHeader(h.get('x-vercel-ip-city')) ?? 'mumbai';
  const city = cityBySlug(slug)!;
  const today = todayIST();
  return (
    <Page alt="/hi">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Khula Hai', url: abs('/'), inLanguage: ['en-IN', 'hi-IN'] }} />
      <HomeView city={city} today={today} />
    </Page>
  );
}
