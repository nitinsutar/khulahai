import { notFound } from 'next/navigation';
import { Page } from '@/components/page';
import { HomeView } from '@/components/home';
import { CITIES, cityBySlug } from '@/lib/places';
import { todayIST } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city)!;
  return meta({
    title: `Is it open today in ${c.name}? Banks, share market & post office`,
    description: `${c.name} today: are banks open, is the share market trading, and are post offices open? Live daily status with reasons and next working day, from official RBI, NSE and DoPT lists.`,
    path: `/${c.slug}`,
    og: { t: `${c.name} today`, s: 'Banks · Share market · Post office' },
  });
}
export default async function CityHub({ params }: { params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c) notFound();
  return <Page alt={`/hi/${c.slug}/bank`}><HomeView city={c} today={todayIST()} /></Page>;
}
