import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, addDays, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export async function generateMetadata() {
  const d = addDays(todayIST(), 1);
  return meta({
    title: `Bank holiday tomorrow (${fmtMed(d)}): are banks open tomorrow?`,
    description: `Is tomorrow a bank holiday? See where banks are closed on ${fmtMed(d)} across India, by state and city, from the official RBI holiday list.`,
    path: '/bank-holiday-tomorrow',
    og: { t: 'Bank holiday tomorrow', s: fmtMed(d) },
  });
}
export default function P() {
  const t = todayIST();
  return <Page><TodayAll day={addDays(t, 1)} label="tomorrow" today={t} /></Page>;
}
