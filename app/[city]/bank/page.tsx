import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { BankView, bankFaq } from '@/components/bank';
import { CITIES, cityBySlug, stateBySlug } from '@/lib/places';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, cityHolidays } from '@/lib/data';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';
import { bankShort } from '@/lib/text';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const s = bankDay(cityHolidays(c), t);
  return meta({
    title: `Is bank open today in ${c.name}? Bank holiday today (${fmtMed(t)})`,
    description: `Banks in ${c.name} are ${s.open ? 'open' : 'closed'} today, ${fmtMed(t)} — ${bankShort(s.reason, 'en')}. See tomorrow, this Saturday, next working day and the RBI holiday list for ${stateBySlug(c.state)!.name}.`,
    path: `/${c.slug}/bank`, en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank`,
    og: { t: `Banks in ${c.name}`, s: `${s.open ? 'Open' : 'Closed'} today · ${fmtMed(t)}`, v: s.open ? 'yes' : 'no' },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return (
    <Page alt={`/hi/${c.slug}/bank`}>
      <JsonLd data={[faqLd(bankFaq(c, 'en')), crumbLd([{ name: 'Home', path: '/' }, { name: c.name, path: `/${c.slug}` }, { name: 'Banks', path: `/${c.slug}/bank` }])]} />
      <BankView city={c} today={todayIST()} />
    </Page>
  );
}
