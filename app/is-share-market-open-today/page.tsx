import { Page } from '@/components/page';
import { MarketView, marketFaq } from '@/components/market';
import { todayIST, nowISTMinutes, fmtMed, fmtLong } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';
import { marketDay, nextMarketOpen, NSE } from '@/lib/data';
import { webPageLd, qaLd } from '@/lib/ld';

export const revalidate = 60;
const PATH = '/is-share-market-open-today';
export async function generateMetadata() {
  const t = todayIST();
  const m = marketDay(t);
  return meta({
    title: `Is the Share Market Open Today? ${fmtMed(t)} — NSE & BSE ${m.open ? 'Open' : 'Closed'}`,
    description: `${m.open ? `Yes, NSE and BSE are open today, ${fmtMed(t)}, 9:15 am–3:30 pm IST.` : `No, NSE and BSE are closed today, ${fmtMed(t)}${m.kind === 'holiday' ? ` for ${m.name}` : ''}. Trading resumes ${fmtMed(nextMarketOpen(t))}.`} Tomorrow’s status, MCX sessions and the 2026 holiday list from NSE/BSE circulars.`,
    path: PATH, en: PATH, hi: '/hi/share-market',
    og: { t: 'Share market today', s: `${m.open ? 'Open' : 'Closed'} · ${fmtMed(t)}`, v: m.open ? 'yes' : 'no' },
  });
}
export default function P() {
  const t = todayIST();
  const m = marketDay(t);
  const a = m.open ? `Yes, NSE and BSE are open today, ${fmtLong(t)}. The equity session runs 9:15 am to 3:30 pm IST.` : `No, NSE and BSE are closed today, ${fmtLong(t)}${m.kind === 'holiday' ? `, for ${m.name}` : ' (weekend)'}. Trading resumes ${fmtLong(nextMarketOpen(t))}.`;
  return (
    <Page alt="/hi/share-market">
      <JsonLd data={[
        webPageLd({ name: 'Is the share market open today?', path: PATH, basedOn: [NSE.source, NSE.bseSource] }),
        qaLd({ q: `Is the share market open today (${fmtLong(t)})?`, a, path: PATH }),
        faqLd(marketFaq('en')),
        crumbLd([{ name: 'Home', path: '/' }, { name: 'Share market today', path: PATH }]),
      ]} />
      <MarketView today={t} mins={nowISTMinutes()} mode="status" />
    </Page>
  );
}
