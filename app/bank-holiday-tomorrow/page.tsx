import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, addDays, fmtDMs } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankNationalMeta } from '@/lib/titles';

export const revalidate = 300;
export async function generateMetadata() {
  const d = addDays(todayIST(), 1);
  const m = bankNationalMeta(d, 'en', 'tomorrow');
  return meta({
    title: m.title,
    description: m.description,
    path: '/bank-holiday-tomorrow',
    og: { t: m.title, s: fmtDMs(d), v: m.ogV },
  });
}
export default function P() {
  const t = todayIST();
  return <Page><TodayAll day={addDays(t, 1)} label="tomorrow" today={t} /></Page>;
}
