import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { WeekendsState } from '@/components/weekends';
import { STATES, stateBySlug } from '@/lib/places';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => STATES.map((s) => ({ state: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const st = stateBySlug((await params).state);
  if (!st) return {};
  return meta({
    title: `Long weekends 2026 in ${st.name}: official RBI bank holidays`,
    description: `Upcoming 3-day bank holiday breaks in ${st.name}, and days where taking one leave gives you four off, from the official RBI 2026 list. The 2027 list is not out yet.`,
    path: `/long-weekends/${st.slug}`,
    en: `/long-weekends/${st.slug}`,
    hi: `/hi/long-weekends/${st.slug}`,
    og: { t: `Long weekends in ${st.name}`, s: 'Official RBI 2026 list' },
  });
}

export default async function StateWeekends({ params }: { params: Promise<{ state: string }> }) {
  const st = stateBySlug((await params).state);
  if (!st) notFound();
  return <Page alt={`/hi/long-weekends/${st.slug}`}><WeekendsState slug={st.slug} /></Page>;
}
