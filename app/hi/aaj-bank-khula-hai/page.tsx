import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, fmtDM } from '@/lib/date';
import { meta } from '@/lib/meta';
import { todayAlts, hrefLangMap } from '@/lib/lang';
import { RBI } from '@/lib/data';
import { bankNationalMeta } from '@/lib/titles';
import { JsonLd, crumbLd } from '@/components/ui';
import { webPageLd } from '@/lib/ld';

export const revalidate = 300;
const PATH = '/hi/aaj-bank-khula-hai';
export async function generateMetadata() {
  const t = todayIST();
  const m = bankNationalMeta(t, 'hi', 'today');
  return meta({
    title: m.title,
    description: m.description,
    path: PATH, languages: hrefLangMap(todayAlts()),
    og: { t: m.title, s: fmtDM(t, 'hi'), v: m.ogV },
  });
}
export default function P() {
  const t = todayIST();
  return (
    <Page lang="hi" alts={todayAlts()}>
      <JsonLd data={[
        webPageLd({ name: 'आज बैंक खुला है या नहीं?', path: PATH, lang: 'hi', basedOn: [RBI.source] }),
        crumbLd([{ name: 'होम', path: '/hi' }, { name: 'आज बैंक खुला है?', path: PATH }]),
      ]} />
      <TodayAll day={t} label="today" today={t} lang="hi" />
    </Page>
  );
}
