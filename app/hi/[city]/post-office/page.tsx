import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { PostView, postFaq } from '@/components/post';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';
import { cityAlts, hrefLangMap } from '@/lib/lang';
import { postDay, cityHolidays } from '@/lib/data';
import { postCityMeta } from '@/lib/titles';
import { JsonLd, faqLd } from '@/components/ui';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const p = postDay(c.state, t, cityHolidays(c));
  const m = postCityMeta(c, t, p, 'hi');
  return meta({
    title: m.title,
    description: m.description,
    path: `/hi/${c.slug}/post-office`, languages: hrefLangMap(cityAlts(c.slug, 'post-office')),
    og: { t: m.title, s: m.title, v: m.ogV },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return (
    <Page lang="hi" alts={cityAlts(c.slug, "post-office")}>
      <JsonLd data={faqLd(postFaq(c, 'hi'))} />
      <PostView city={c} today={todayIST()} lang="hi" />
    </Page>
  );
}
