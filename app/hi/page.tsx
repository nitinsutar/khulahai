import { headers } from 'next/headers';
import { Page } from '@/components/page';
import { HomeView } from '@/components/home';
import { cityBySlug } from '@/lib/places';
import { todayIST } from '@/lib/date';
import { cityFromHeader } from '@/lib/geo';
import { meta } from '@/lib/meta';

export const dynamic = 'force-dynamic';
export const metadata = meta({
  title: 'आज बैंक खुला है या नहीं? आज की बैंक छुट्टी | खुला है',
  description: 'क्या आज बैंक खुला है? अपने शहर में आज बैंक, शेयर बाज़ार और डाकघर खुले हैं या बंद — आरबीआई, NSE और सरकारी सूची से हर दिन अपडेट।',
  path: '/hi', en: '/', hi: '/hi',
  og: { t: 'आज बैंक खुला है?', s: 'बैंक · शेयर बाज़ार · डाकघर' },
});
export default async function HiHome() {
  const h = await headers();
  const city = cityBySlug(cityFromHeader(h.get('x-vercel-ip-city')) ?? 'mumbai')!;
  return <Page lang="hi" alt="/"><HomeView city={city} today={todayIST()} lang="hi" /></Page>;
}
