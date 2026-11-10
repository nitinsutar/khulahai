import { webPageLd } from '@/lib/ld';
import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { StateYear } from '@/components/lists';
import { STATES, stateBySlug } from '@/lib/places';
import { RBI, stateHolidays } from '@/lib/data';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
import { JsonLd, holidayListLd, crumbLd } from '@/components/ui';
import { shortName } from '@/lib/names';

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => STATES.map((s) => ({ state: s.slug }));
export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const s = stateBySlug((await params).state)!;
  const n = stateHolidays(s.slug).length;
  return meta({
    title: `Bank Holidays 2026 in ${s.name}: ${n} Days (RBI${s.mappedFrom ? ` ${s.mappedFrom}` : ''} List)`,
    description: `All ${n} bank holidays in ${s.name} for 2026 from the RBI holiday list, with 2nd & 4th Saturdays, a month calendar, and an add-to-calendar file. Applies to scheduled banks like SBI, HDFC and ICICI.${s.mappedFrom ? ` Mapped from RBI’s ${s.mappedFrom} centre.` : ''}`,
    path: `/bank-holidays-2026/${s.slug}`,
    og: { t: `Bank holidays 2026 · ${s.name}`, s: `${n} RBI holidays + 2nd & 4th Saturdays` },
  });
}
export default async function P({ params }: { params: Promise<{ state: string }> }) {
  const s = stateBySlug((await params).state);
  if (!s) notFound();
  const list = stateHolidays(s.slug);
  return (
    <Page>
      <JsonLd data={[webPageLd({ name: `Bank holidays 2026 in ${s.name}`, path: `/bank-holidays-2026/${s.slug}`, basedOn: [RBI.source] }), holidayListLd(`Bank holidays 2026 in ${s.name}`, `/bank-holidays-2026/${s.slug}`, list.map((h) => ({ d: h.d, n: shortName(h.n) }))), crumbLd([{ name: 'Home', path: '/' }, { name: 'Bank holidays 2026', path: '/bank-holidays-2026' }, { name: s.name, path: `/bank-holidays-2026/${s.slug}` }])]} />
      <StateYear slug={s.slug} today={todayIST()} />
    </Page>
  );
}
