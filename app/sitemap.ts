import type { MetadataRoute } from 'next';
import { CITIES, STATES } from '@/lib/places';
import { MONTHS } from '@/lib/date';
import { abs } from '@/lib/site';
import { todayAlts, cityAlts, hrefLangMap, langsForCity, cityPath, TODAY_PATH, type Lang } from '@/lib/lang';

export const revalidate = 86400;
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const langs = (alts: { lang: string; href: string }[]) => {
    const m = hrefLangMap(alts as any);
    return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, abs(v)]));
  };
  const e = (p: string, priority = 0.7, changeFrequency: 'daily' | 'monthly' | 'weekly' = 'daily', alt?: { en: string; hi: string } | Record<string, string>) => ({
    url: abs(p), lastModified: now, changeFrequency, priority,
    ...(alt ? { alternates: { languages: 'en' in (alt as any) && 'hi' in (alt as any) && !('en-IN' in (alt as any)) ? { 'en-IN': abs((alt as any).en), 'hi-IN': abs((alt as any).hi) } : (alt as Record<string, string>) } } : {}),
  });
  return [
    e('/', 1, 'daily', { en: '/', hi: '/hi' }),
    e('/hi', 0.9, 'daily', { en: '/', hi: '/hi' }),
    e('/bank-holiday-today', 1, 'daily', langs(todayAlts())), e('/hi/aaj-bank-khula-hai', 0.9, 'daily', langs(todayAlts())), e(TODAY_PATH.mr, 0.9, 'daily', langs(todayAlts())), e(TODAY_PATH.gu, 0.9, 'daily', langs(todayAlts())), e(TODAY_PATH.bn, 0.9, 'daily', langs(todayAlts())),
    e('/is-bank-open-on-guru-nanak-jayanti-2026', 0.9, 'daily', { en: '/is-bank-open-on-guru-nanak-jayanti-2026', hi: '/hi/guru-nanak-jayanti-2026-bank-khula-hai' }), e('/hi/guru-nanak-jayanti-2026-bank-khula-hai', 0.8, 'daily', { en: '/is-bank-open-on-guru-nanak-jayanti-2026', hi: '/hi/guru-nanak-jayanti-2026-bank-khula-hai' }),
    e('/is-post-office-open-today', 0.8), e('/bank-holiday-tomorrow', 0.8), e('/saturday-bank-holiday', 0.8), 
    e('/bank-holidays-2026', 0.9, 'weekly'), e('/sbi-holiday-list-2026', 0.8, 'weekly'),
    e('/is-share-market-open-today', 0.9, 'daily', { en: '/is-share-market-open-today', hi: '/hi/share-market' }), e('/hi/share-market', 0.7, 'daily', { en: '/is-share-market-open-today', hi: '/hi/share-market' }),
    e('/nse-bse-holidays-2026', 0.9, 'weekly'), e('/nse-bse-holidays-2027', 0.6, 'weekly'), e('/bank-holidays-2027', 0.6, 'weekly'),
    e('/post-office-holidays-2026', 0.8, 'weekly'), e('/post-office-holidays-2027', 0.7, 'weekly'),
    e('/about', 0.3, 'monthly'), e('/privacy', 0.2, 'monthly'),
    ...STATES.map((s) => e(`/bank-holidays-2026/${s.slug}`, 0.8, 'weekly')),
    ...MONTHS.map((m) => e(`/bank-holidays/${m}-2026`, 0.6, 'weekly')),
    ...CITIES.flatMap((c) => {
      const bank = langs(cityAlts(c.slug, 'bank'));
      const post = langs(cityAlts(c.slug, 'post-office'));
      const extra = langsForCity(c.slug).filter((l) => l !== 'en' && l !== 'hi').flatMap((l) => [
        e(cityPath(l, c.slug, 'bank'), 0.8, 'daily', bank),
        e(cityPath(l, c.slug, 'post-office'), 0.6, 'daily', post),
      ]);
      return [
        e(`/${c.slug}`, 0.7),
        e(`/${c.slug}/bank`, 0.8, 'daily', bank),
        e(`/hi/${c.slug}/bank`, 0.7, 'daily', bank),
        e(`/${c.slug}/post-office`, 0.6, 'daily', post),
        e(`/hi/${c.slug}/post-office`, 0.5, 'daily', post),
        ...extra,
      ];
    }),
  ];
}
