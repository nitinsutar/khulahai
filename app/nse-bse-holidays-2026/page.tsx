import { Page } from '@/components/page';
import { MarketView, marketFaq } from '@/components/market';
import { todayIST, nowISTMinutes } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd, holidayListLd } from '@/components/ui';
import { NSE } from '@/lib/data';

export const revalidate = 300;
export const metadata = meta({
  title: 'NSE holiday list 2026: BSE & NSE trading holidays (official)',
  description: 'NSE and BSE trading holidays 2026 — all 16 weekday closures from the official exchange circulars, plus holidays falling on weekends, Muhurat trading and an add-to-calendar file.',
  path: '/nse-bse-holidays-2026',
  og: { t: 'NSE & BSE holidays 2026', s: '16 weekday closures · official list' },
});
export default function P() {
  return (
    <Page alt="/hi/share-market">
      <JsonLd data={[faqLd(marketFaq('en')), holidayListLd('NSE & BSE trading holidays 2026', '/nse-bse-holidays-2026', NSE.holidays.filter((h) => !h.weekend))]} />
      <MarketView today={todayIST()} mins={nowISTMinutes()} mode="list" />
    </Page>
  );
}
