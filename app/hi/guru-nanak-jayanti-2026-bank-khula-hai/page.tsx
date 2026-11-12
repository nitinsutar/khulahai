import { Page } from '@/components/page';
import { GnjView, gnjAnswer, gnjFaq, gnjData, GNJ } from '@/components/gnj';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';
import { webPageLd } from '@/lib/ld';
import { RBI, NSE, MCX, INDIAPOST } from '@/lib/data';

export const revalidate = 3600;
const PATH = '/hi/guru-nanak-jayanti-2026-bank-khula-hai';
export function generateMetadata() {
  const n = gnjData().closed.length;
  return meta({
    title: 'गुरु नानक जयंती 2026 (24 नवंबर) को बैंक खुला है या नहीं? शहरवार सूची',
    description: `ज़्यादातर नहीं — 24 नवंबर 2026 को आरबीआई के 34 में से ${n} केंद्रों (मुंबई, दिल्ली सहित) में बैंक बंद; बेंगलुरु, चेन्नई में खुले। NSE/BSE बंद, MCX शाम खुला।`,
    path: PATH, en: '/is-bank-open-on-guru-nanak-jayanti-2026', hi: PATH,
    og: { t: 'गुरु नानक जयंती 2026', s: `24 नवंबर · ${n} केंद्रों में बैंक बंद`, v: 'no' },
  });
}
export default function P() {
  return (
    <Page lang="hi" alt="/is-bank-open-on-guru-nanak-jayanti-2026">
      <JsonLd data={[
        webPageLd({ name: 'गुरु नानक जयंती 2026 पर बैंक खुला है या नहीं?', path: PATH, lang: 'hi', basedOn: [RBI.source, NSE.source, MCX.source, INDIAPOST.source] }),
        faqLd(gnjFaq('hi')),
        crumbLd([{ name: 'होम', path: '/hi' }, { name: 'गुरु नानक जयंती 2026', path: PATH }]),
      ]} />
      <GnjView lang="hi" />
    </Page>
  );
}
