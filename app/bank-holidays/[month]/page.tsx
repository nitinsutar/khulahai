import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { MonthAll } from '@/components/lists';
import { MONTHS, monthName, todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, crumbLd } from '@/components/ui';
import { webPageLd } from '@/lib/ld';
import { RBI } from '@/lib/data';

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => MONTHS.map((m) => ({ month: `${m}-2026` }));
const parse = (s: string) => { const i = MONTHS.indexOf(s.replace(/-2026$/, '')); return s.endsWith('-2026') && i >= 0 ? i + 1 : 0; };
export async function generateMetadata({ params }: { params: Promise<{ month: string }> }) {
  const m = parse((await params).month);
  const n = monthName(m);
  return meta({
    title: `Bank Holidays in ${n} 2026: State-wise List (RBI)`,
    description: `Bank holidays in ${n} 2026 across India — every RBI holiday by state and city, plus the 2nd and 4th Saturdays. Check if banks are closed in your state this month.`,
    path: `/bank-holidays/${MONTHS[m - 1]}-2026`,
    og: { t: `Bank holidays · ${n} 2026`, s: 'State-wise RBI list' },
  });
}
export default async function P({ params }: { params: Promise<{ month: string }> }) {
  const m = parse((await params).month);
  if (!m) notFound();
  const path = `/bank-holidays/${MONTHS[m - 1]}-2026`;
  return <Page><JsonLd data={[webPageLd({ name: `Bank holidays in ${monthName(m)} 2026`, path, basedOn: [RBI.source] }), crumbLd([{ name: 'Home', path: '/' }, { name: 'Bank holidays 2026', path: '/bank-holidays-2026' }, { name: `${monthName(m)} 2026`, path }])]} /><MonthAll month={m} today={todayIST()} /></Page>;
}
