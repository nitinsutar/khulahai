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
    title: `${st.hi} के लंबे सप्ताहांत 2026: आधिकारिक आरबीआई सूची`,
    description: `${st.hi} में आने वाले 3 दिन के बैंक अवकाश, और जहाँ एक दिन की छुट्टी लेकर चार दिन मिलते हैं, 2026 की आधिकारिक आरबीआई सूची से। 2027 की सूची अभी नहीं आई है।`,
    path: `/hi/long-weekends/${st.slug}`,
    en: `/long-weekends/${st.slug}`,
    hi: `/hi/long-weekends/${st.slug}`,
    og: { t: `${st.hi} के लंबे सप्ताहांत`, s: 'आधिकारिक आरबीआई 2026 सूची' },
  });
}

export default async function HiStateWeekends({ params }: { params: Promise<{ state: string }> }) {
  const st = stateBySlug((await params).state);
  if (!st) notFound();
  return <Page lang="hi" alt={`/long-weekends/${st.slug}`}><WeekendsState slug={st.slug} lang="hi" /></Page>;
}
