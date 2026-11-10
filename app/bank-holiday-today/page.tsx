import { Page } from '@/components/page';
import { TodayAll, todayAllAnswer } from '@/components/lists';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, officesClosedOn, RBI } from '@/lib/data';
import { JsonLd, crumbLd } from '@/components/ui';
import { webPageLd, qaLd } from '@/lib/ld';

export const revalidate = 300;
const PATH = '/bank-holiday-today';
export async function generateMetadata() {
  const t = todayIST();
  const n = officesClosedOn(t).length;
  const all = !bankDay([], t).open;
  return meta({
    title: `Bank Holiday Today (${fmtMed(t)}): Is the Bank Open Today or Not?`,
    description: all ? `No — banks are closed across India today, ${fmtMed(t)} (${bankDay([], t).reason.kind === 'sunday' ? 'Sunday' : 'bank Saturday'}). UPI and ATMs work. See next working day.` : n ? `Banks are open in most of India today, ${fmtMed(t)}, but closed at ${n} RBI centres. See exactly where, city by city, from RBI’s holiday matrix.` : `Yes — banks are open across India today, ${fmtMed(t)}. No RBI centre lists a holiday. Check your city and tomorrow.`,
    path: PATH, en: PATH, hi: '/hi/aaj-bank-khula-hai',
    og: { t: 'Bank holiday today', s: fmtMed(t) },
  });
}
export default function P() {
  const t = todayIST();
  const a = todayAllAnswer(t, 'today');
  return (
    <Page alt="/hi/aaj-bank-khula-hai">
      <JsonLd data={[
        webPageLd({ name: 'Bank holiday today', path: PATH, basedOn: [RBI.source] }),
        qaLd({ q: 'Is the bank open today?', a: `${a.b} ${a.r}`, path: PATH }),
        crumbLd([{ name: 'Home', path: '/' }, { name: 'Bank holiday today', path: PATH }]),
      ]} />
      <TodayAll day={t} label="today" today={t} />
    </Page>
  );
}
