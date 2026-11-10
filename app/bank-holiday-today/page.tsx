import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { officesClosedOn } from '@/lib/data';

export const revalidate = 300;
export async function generateMetadata() {
  const t = todayIST();
  const n = officesClosedOn(t).length;
  return meta({
    title: `Bank holiday today (${fmtMed(t)}): is bank open today or not?`,
    description: `Is today a bank holiday? ${n ? `Banks are closed today in ${n} RBI centres` : 'No RBI holiday today'} — see exactly where banks are open or closed on ${fmtMed(t)}, state by state.`,
    path: '/bank-holiday-today',
    og: { t: 'Bank holiday today', s: fmtMed(t) },
  });
}
export default function P() {
  const t = todayIST();
  return <Page><TodayAll day={t} label="today" today={t} /></Page>;
}
