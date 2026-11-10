import { webPageLd, datasetLd } from '@/lib/ld';
import { Page } from '@/components/page';
import { MarketView, marketFaq } from '@/components/market';
import { todayIST, nowISTMinutes } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd, holidayListLd } from '@/components/ui';
import { NSE } from '@/lib/data';

export const revalidate = 300;
export const metadata = meta({
  title: 'NSE & BSE Holiday List 2026: 16 Trading Holidays (Exchange Circulars)',
  description: 'NSE and BSE trading holidays 2026 — all 16 weekday closures from NSE and BSE circulars, plus holidays falling on weekends, Muhurat trading and an add-to-calendar file.',
  path: '/nse-bse-holidays-2026',
  og: { t: 'NSE & BSE holidays 2026', s: '16 weekday closures · NSE/BSE circulars' },
});
export default function P() {
  return (
    <Page alt="/hi/share-market">
      <JsonLd data={[webPageLd({ name: 'NSE & BSE holidays 2026', path: '/nse-bse-holidays-2026', basedOn: [NSE.source, NSE.bseSource, NSE.bseSource2] }), datasetLd({ name: 'NSE & BSE equity trading holidays 2026', description: 'Equity segment trading holidays for 2026 from NSE and BSE circulars, with weekend flags.', path: '/nse-bse-holidays-2026', csv: '/data/nse-bse-holidays-2026.csv', temporal: '2026-01-01/2026-12-31', basedOn: NSE.source }), faqLd(marketFaq('en')), holidayListLd('NSE & BSE trading holidays 2026', '/nse-bse-holidays-2026', NSE.holidays.filter((h) => !h.weekend))]} />
      <MarketView today={todayIST()} mins={nowISTMinutes()} mode="list" />
    </Page>
  );
}
