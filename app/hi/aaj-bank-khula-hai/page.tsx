import { Page } from '@/components/page';
import { TodayAll, todayAllAnswer } from '@/components/lists';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, officesClosedOn, RBI } from '@/lib/data';
import { JsonLd, crumbLd } from '@/components/ui';
import { webPageLd, qaLd } from '@/lib/ld';

export const revalidate = 300;
const PATH = '/hi/aaj-bank-khula-hai';
export async function generateMetadata() {
  const t = todayIST();
  const n = officesClosedOn(t).length;
  const all = !bankDay([], t).open;
  return meta({
    title: `आज बैंक खुला है या नहीं? (${fmtMed(t, 'hi')}) आज की बैंक छुट्टी`,
    description: all ? `नहीं — आज, ${fmtMed(t, 'hi')}, पूरे भारत में बैंक बंद हैं। UPI और ATM चलते रहेंगे।` : n ? `आज, ${fmtMed(t, 'hi')}, ज़्यादातर भारत में बैंक खुले हैं, लेकिन ${n} आरबीआई केंद्रों में बंद हैं। अपने शहर की स्थिति देखें।` : `हाँ — आज, ${fmtMed(t, 'hi')}, पूरे भारत में बैंक खुले हैं। किसी भी आरबीआई केंद्र पर अवकाश नहीं है।`,
    path: PATH, en: '/bank-holiday-today', hi: PATH,
    og: { t: 'आज बैंक खुला है?', s: fmtMed(t, 'hi') },
  });
}
export default function P() {
  const t = todayIST();
  const a = todayAllAnswer(t, 'today', 'hi');
  return (
    <Page lang="hi" alt="/bank-holiday-today">
      <JsonLd data={[
        webPageLd({ name: 'आज बैंक खुला है या नहीं?', path: PATH, lang: 'hi', basedOn: [RBI.source] }),
        qaLd({ q: 'क्या आज बैंक खुला है?', a: `${a.b} ${a.r}`, path: PATH, lang: 'hi' }),
        crumbLd([{ name: 'होम', path: '/hi' }, { name: 'आज बैंक खुला है?', path: PATH }]),
      ]} />
      <TodayAll day={t} label="today" today={t} lang="hi" />
    </Page>
  );
}
