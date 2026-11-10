import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { PostView, postFaq, postLabel } from '@/components/post';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { postDay, cityHolidays } from '@/lib/data';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const p = postDay(c.state, t, cityHolidays(c));
  return meta({
    title: `Is post office open today in ${c.name}? Timings & holidays (${fmtMed(t)})`,
    description: `Post offices in ${c.name}: ${postLabel(p, 'en')} today, ${fmtMed(t)}. Typical counter hours, tomorrow's status, Saturday rules and the official central government holiday list.`,
    path: `/${c.slug}/post-office`, en: `/${c.slug}/post-office`, hi: `/hi/${c.slug}/post-office`,
    og: { t: `Post office in ${c.name}`, s: `${postLabel(p, 'en')} today · ${fmtMed(t)}`, v: p.state === 'closed' ? 'no' : p.state === 'check' ? 'neu' : 'yes' },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return (
    <Page alt={`/hi/${c.slug}/post-office`}>
      <JsonLd data={[faqLd(postFaq(c, 'en')), crumbLd([{ name: 'Home', path: '/' }, { name: c.name, path: `/${c.slug}` }, { name: 'Post office', path: `/${c.slug}/post-office` }])]} />
      <PostView city={c} today={todayIST()} />
    </Page>
  );
}
