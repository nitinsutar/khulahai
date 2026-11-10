import { Page } from '@/components/page';
import { MonthAll } from '@/components/lists';
import { monthName, monthNum, todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export async function generateMetadata() {
  const t = todayIST();
  const n = monthName(monthNum(t));
  return meta({
    title: `Bank holidays this month (${n} ${t.slice(0, 4)}): state-wise list`,
    description: `Bank holidays this month — ${n} ${t.slice(0, 4)}. Every RBI holiday by state, the 2nd & 4th Saturdays and Sundays, updated automatically each month.`,
    path: '/bank-holiday-this-month',
    og: { t: 'Bank holidays this month', s: `${n} ${t.slice(0, 4)}` },
  });
}
export default function P() {
  const t = todayIST();
  const m = t.startsWith('2026') ? monthNum(t) : 12;
  return <Page><MonthAll month={m} today={t} h1={`Bank holidays this month: ${monthName(m)} 2026`} /></Page>;
}
