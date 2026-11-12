import { webPageLd } from '@/lib/ld';
import { bankAnswerText } from '@/components/answer';
import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { BankView, bankFaq } from '@/components/bank';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, cityHolidays, nextBankOpen, RBI } from '@/lib/data';
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
    title: `आज ${c.hi} में बैंक खुला है या नहीं? ${fmtMed(t, 'hi')}: ${s.open ? 'खुला' : 'बंद'}`,
    description: `${s.open ? 'हाँ' : 'नहीं'} — ${c.hi} में आज बैंक ${s.open ? 'खुले हैं' : 'बंद हैं'} — ${bankShort(s.reason, 'hi')}। कल, इस शनिवार और अगले कार्य दिवस की जानकारी, आरबीआई सूची से।`,
    path: `/hi/${c.slug}/bank`, en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank`,
    og: { t: `${c.hi} में बैंक`, s: s.open ? 'आज खुला है' : 'आज बंद है', v: s.open ? 'yes' : 'no' },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  const t = todayIST();
  const st = bankDay(cityHolidays(c), t);
  return (
    <Page lang="hi" alt={`/${c.slug}/bank`}>
      <JsonLd data={[webPageLd({ name: `क्या आज ${c.hi} में बैंक खुला है?`, path: `/hi/${c.slug}/bank`, lang: 'hi', basedOn: [RBI.source] }), faqLd(bankFaq(c, 'hi')), crumbLd([{ name: 'होम', path: '/hi' }, { name: c.hi, path: `/hi/${c.slug}/bank` }])]} />
      <BankView city={c} today={t} lang="hi" />
    </Page>
  );
}
