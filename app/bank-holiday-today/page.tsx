import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, fmtDMs } from '@/lib/date';
import { meta } from '@/lib/meta';
import { todayAlts, hrefLangMap } from '@/lib/lang';
import { RBI } from '@/lib/data';
import { bankNationalMeta } from '@/lib/titles';
import { JsonLd, crumbLd } from '@/components/ui';
import { webPageLd } from '@/lib/ld';

export const revalidate = 300;
const PATH = '/bank-holiday-today';
export async function generateMetadata() {
  const t = todayIST();
  const m = bankNationalMeta(t, 'en', 'today');
  return meta({
    title: m.title,
    description: m.description,
    path: PATH, languages: hrefLangMap(todayAlts()),
    og: { t: m.title, s: fmtDMs(t), v: m.ogV },
  });
}
export default function P() {
  const t = todayIST();
  return (
    <Page alts={todayAlts()}>
      <JsonLd data={[
        webPageLd({ name: 'Bank holiday today', path: PATH, basedOn: [RBI.source] }),
        crumbLd([{ name: 'Home', path: '/' }, { name: 'Bank holiday today', path: PATH }]),
      ]} />
      <TodayAll day={t} label="today" today={t} />
    </Page>
  );
}
