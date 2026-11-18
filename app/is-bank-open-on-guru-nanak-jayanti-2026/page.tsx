import { Page } from '@/components/page';
import { GnjView, gnjAnswer, gnjFaq, gnjData, GNJ } from '@/components/gnj';
import { meta } from '@/lib/meta';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';
import { webPageLd } from '@/lib/ld';
import { RBI, NSE, MCX, INDIAPOST } from '@/lib/data';

export const revalidate = 3600;
const PATH = '/is-bank-open-on-guru-nanak-jayanti-2026';
export function generateMetadata() {
  const n = gnjData().closed.length;
  return meta({
    title: `Guru Nanak Jayanti 24 Nov: banks closed in ${n} centres`,
    description: `Guru Nanak Jayanti 24 Nov: banks closed at ${n} of 34 centres (Mumbai, Delhi). Open in Bengaluru, Chennai, Patna and Ahmedabad. NSE/BSE closed; MCX evening open.`,
    path: PATH, en: PATH, hi: '/hi/guru-nanak-jayanti-2026-bank-khula-hai',
    og: { t: 'Guru Nanak Jayanti 2026', s: `24 Nov · banks closed in ${n} of 34 centres`, v: 'no' },
  });
}
export default function P() {
  return (
    <Page alt="/hi/guru-nanak-jayanti-2026-bank-khula-hai">
      <JsonLd data={[
        webPageLd({ name: 'Is the bank open on Guru Nanak Jayanti 2026?', path: PATH, basedOn: [RBI.source, NSE.source, MCX.source, INDIAPOST.source] }),
        faqLd(gnjFaq('en')),
        crumbLd([{ name: 'Home', path: '/' }, { name: 'Bank holidays November 2026', path: '/bank-holidays/november-2026' }, { name: 'Guru Nanak Jayanti 2026', path: PATH }]),
      ]} />
      <GnjView />
    </Page>
  );
}
