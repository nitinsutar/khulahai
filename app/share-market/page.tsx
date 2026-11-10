import { Page } from '@/components/page';
import { MarketView, marketFaq } from '@/components/market';
import { todayIST, nowISTMinutes } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd } from '@/components/ui';

export const revalidate = 60;
export const metadata = meta({
  title: 'Is the share market open today? NSE & BSE status and timings',
  description: 'Is the stock market open today? Live NSE and BSE status for today and tomorrow, market timings 9:15 am–3:30 pm IST, and the 2026 trading holiday list.',
  path: '/share-market', en: '/share-market', hi: '/hi/share-market',
  og: { t: 'Share market today', s: 'NSE · BSE · 9:15–15:30 IST' },
});
export default function P() {
  return (
    <Page alt="/hi/share-market">
      <JsonLd data={faqLd(marketFaq('en'))} />
      <MarketView today={todayIST()} mins={nowISTMinutes()} mode="status" />
    </Page>
  );
}
