import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { MonthAll } from '@/components/lists';
import { MONTHS, monthName, todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => MONTHS.map((m) => ({ month: `${m}-2026` }));
const parse = (s: string) => { const i = MONTHS.indexOf(s.replace(/-2026$/, '')); return s.endsWith('-2026') && i >= 0 ? i + 1 : 0; };
export async function generateMetadata({ params }: { params: Promise<{ month: string }> }) {
  const m = parse((await params).month);
  const n = monthName(m);
  return meta({
    title: `Bank holidays in ${n} 2026: state-wise RBI list`,
    description: `Bank holidays in ${n} 2026 across India — every RBI holiday by state and city, plus the 2nd and 4th Saturdays. Check if banks are closed in your state this month.`,
    path: `/bank-holidays/${MONTHS[m - 1]}-2026`,
    og: { t: `Bank holidays · ${n} 2026`, s: 'State-wise RBI list' },
  });
}
export default async function P({ params }: { params: Promise<{ month: string }> }) {
  const m = parse((await params).month);
  if (!m) notFound();
  return <Page><MonthAll month={m} today={todayIST()} /></Page>;
}
