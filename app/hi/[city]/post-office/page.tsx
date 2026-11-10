import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { PostView, postFaq, postLabel } from '@/components/post';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST, fmtMed } from '@/lib/date';
import { meta } from '@/lib/meta';
import { postDay, cityHolidays } from '@/lib/data';
import { JsonLd, faqLd } from '@/components/ui';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  const t = todayIST();
  const p = postDay(c.state, t, cityHolidays(c));
  return meta({
    title: `आज ${c.hi} में डाकघर खुला है या नहीं? (${fmtMed(t, 'hi')})`,
    description: `${c.hi} में डाकघर आज: ${postLabel(p, 'hi')}। सामान्य समय, कल की स्थिति और केंद्र सरकार की अवकाश सूची।`,
    path: `/hi/${c.slug}/post-office`, en: `/${c.slug}/post-office`, hi: `/hi/${c.slug}/post-office`,
    og: { t: `${c.hi} में डाकघर`, s: postLabel(p, 'hi', true) },
  });
}
export default async function P({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return (
    <Page lang="hi" alt={`/${c.slug}/post-office`}>
      <JsonLd data={faqLd(postFaq(c, 'hi'))} />
      <PostView city={c} today={todayIST()} lang="hi" />
    </Page>
  );
}
