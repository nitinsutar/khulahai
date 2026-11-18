import { webPageLd } from '@/lib/ld';
import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { BankView, bankFaq } from '@/components/bank';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST, fmtDMs } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, cityHolidays, RBI } from '@/lib/data';
import { bankCityMeta, GNJ_2026 } from '@/lib/titles';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const s = bankDay(cityHolidays(c), t);
  const gnj = bankDay(cityHolidays(c), GNJ_2026);
  const m = bankCityMeta(c, t, s, 'en', gnj);
  return meta({
    title: m.title,
    description: m.description,
    path: `/${c.slug}/bank`, en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank`,
    og: { t: m.title, s: `${s.open ? 'Open' : 'Closed'} today · ${fmtDMs(t)}`, v: m.ogV },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  const t = todayIST();
  const st = bankDay(cityHolidays(c), t);
  return (
    <Page alt={`/hi/${c.slug}/bank`}>
      <JsonLd data={[webPageLd({ name: `Is the bank open today in ${c.name}?`, path: `/${c.slug}/bank`, basedOn: [RBI.source] }), faqLd(bankFaq(c, 'en')), crumbLd([{ name: 'Home', path: '/' }, { name: c.name, path: `/${c.slug}` }, { name: 'Banks', path: `/${c.slug}/bank` }])]} />
      <BankView city={c} today={t} />
    </Page>
  );
}
