import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { BankView, bankFaq } from '@/components/bank';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, cityHolidays } from '@/lib/data';
import { JsonLd, faqLd } from '@/components/ui';
import { bankShort } from '@/lib/text';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const s = bankDay(cityHolidays(c), t);
  return meta({
    title: `आज ${c.hi} में बैंक खुला है या नहीं? (${fmtMed(t, 'hi')})`,
    description: `${c.hi} में आज बैंक ${s.open ? 'खुले हैं' : 'बंद हैं'} — ${bankShort(s.reason, 'hi')}। कल, इस शनिवार और अगले कार्य दिवस की जानकारी, आरबीआई सूची से।`,
    path: `/hi/${c.slug}/bank`, en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank`,
    og: { t: `${c.hi} में बैंक`, s: s.open ? 'आज खुला है' : 'आज बंद है', v: s.open ? 'yes' : 'no' },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return (
    <Page lang="hi" alt={`/${c.slug}/bank`}>
      <JsonLd data={faqLd(bankFaq(c, 'hi'))} />
      <BankView city={c} today={todayIST()} lang="hi" />
    </Page>
  );
}
