import type { MetadataRoute } from 'next';
import { CITIES, STATES } from '@/lib/places';
import { MONTHS } from '@/lib/date';
import { abs } from '@/lib/site';

export const revalidate = 86400;
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const e = (p: string, priority = 0.7, changeFrequency: 'daily' | 'monthly' | 'weekly' = 'daily', alt?: { en: string; hi: string }) => ({
    url: abs(p), lastModified: now, changeFrequency, priority,
    ...(alt ? { alternates: { languages: { 'en-IN': abs(alt.en), 'hi-IN': abs(alt.hi) } } } : {}),
  });
  return [
    e('/', 1, 'daily', { en: '/', hi: '/hi' }),
    e('/hi', 0.9, 'daily', { en: '/', hi: '/hi' }),
    e('/bank-holiday-today', 0.9), e('/bank-holiday-tomorrow', 0.8), e('/saturday-bank-holiday', 0.8), e('/bank-holiday-this-month', 0.8),
    e('/bank-holidays-2026', 0.9, 'weekly'), e('/sbi-holiday-list-2026', 0.8, 'weekly'),
    e('/share-market', 0.9, 'daily', { en: '/share-market', hi: '/hi/share-market' }), e('/hi/share-market', 0.7, 'daily', { en: '/share-market', hi: '/hi/share-market' }),
    e('/nse-bse-holidays-2026', 0.9, 'weekly'), e('/nse-bse-holidays-2027', 0.6, 'weekly'), e('/bank-holidays-2027', 0.6, 'weekly'),
    e('/post-office-holidays-2026', 0.8, 'weekly'), e('/post-office-holidays-2027', 0.7, 'weekly'),
    e('/about', 0.3, 'monthly'), e('/privacy', 0.2, 'monthly'),
    ...STATES.map((s) => e(`/bank-holidays-2026/${s.slug}`, 0.8, 'weekly')),
    ...MONTHS.map((m) => e(`/bank-holidays/${m}-2026`, 0.6, 'weekly')),
    ...CITIES.flatMap((c) => [
      e(`/${c.slug}`, 0.7),
      e(`/${c.slug}/bank`, 0.8, 'daily', { en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank` }),
      e(`/hi/${c.slug}/bank`, 0.7, 'daily', { en: `/${c.slug}/bank`, hi: `/hi/${c.slug}/bank` }),
      e(`/${c.slug}/post-office`, 0.6, 'daily', { en: `/${c.slug}/post-office`, hi: `/hi/${c.slug}/post-office` }),
      e(`/hi/${c.slug}/post-office`, 0.5, 'daily', { en: `/${c.slug}/post-office`, hi: `/hi/${c.slug}/post-office` }),
    ]),
  ];
}
