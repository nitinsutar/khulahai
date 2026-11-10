import { Page } from '@/components/page';
import { MarketView, marketFaq } from '@/components/market';
import { todayIST, nowISTMinutes } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd } from '@/components/ui';

export const revalidate = 60;
export const metadata = meta({
  title: 'आज शेयर बाज़ार खुला है या नहीं? NSE BSE छुट्टियाँ 2026',
  description: 'क्या आज शेयर बाज़ार खुला है? NSE और BSE का आज का स्टेटस, ट्रेडिंग समय 9:15–15:30 और 2026 की पूरी छुट्टियों की सूची।',
  path: '/hi/share-market', en: '/is-share-market-open-today', hi: '/hi/share-market',
  og: { t: 'आज शेयर बाज़ार', s: 'NSE · BSE · 9:15–15:30' },
});
export default function P() {
  return (
    <Page lang="hi" alt="/is-share-market-open-today">
      <JsonLd data={faqLd(marketFaq('hi'))} />
      <MarketView today={todayIST()} mins={nowISTMinutes()} lang="hi" mode="status" />
    </Page>
  );
}
