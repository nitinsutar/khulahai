import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, addDays, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export async function generateMetadata() {
  const d = addDays(todayIST(), 1);
  return meta({
    title: `Bank Holiday Tomorrow? ${fmtMed(d)} — Are Banks Open Tomorrow?`,
    description: `Is tomorrow a bank holiday? See where banks are closed on ${fmtMed(d)} across India, by state and city, from RBI’s holiday matrix.`,
    path: '/bank-holiday-tomorrow',
    og: { t: 'Bank holiday tomorrow', s: fmtMed(d) },
  });
}
export default function P() {
  const t = todayIST();
  return <Page><TodayAll day={addDays(t, 1)} label="tomorrow" today={t} /></Page>;
}
