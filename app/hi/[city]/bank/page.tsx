import { webPageLd } from '@/lib/ld';
import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { BankView, bankFaq } from '@/components/bank';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
import { cityAlts, hrefLangMap } from '@/lib/lang';
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
  const m = bankCityMeta(c, t, s, 'hi', gnj);
  return meta({
    title: m.title,
    description: m.description,
    path: `/hi/${c.slug}/bank`, languages: hrefLangMap(cityAlts(c.slug, 'bank')),
    og: { t: m.title, s: s.open ? 'आज खुला है' : 'आज बंद है', v: m.ogV },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  const t = todayIST();
  const st = bankDay(cityHolidays(c), t);
  return (
    <Page lang="hi" alts={cityAlts(c.slug, "bank")}>
      <JsonLd data={[webPageLd({ name: `क्या आज ${c.hi} में बैंक खुला है?`, path: `/hi/${c.slug}/bank`, lang: 'hi', basedOn: [RBI.source] }), faqLd(bankFaq(c, 'hi')), crumbLd([{ name: 'होम', path: '/hi' }, { name: c.hi, path: `/hi/${c.slug}/bank` }])]} />
      <BankView city={c} today={t} lang="hi" />
    </Page>
  );
}
