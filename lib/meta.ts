import type { Metadata } from 'next';
export function meta({ title, description, path, en, hi, og }: { title: string; description: string; path: string; en?: string; hi?: string; og?: { t: string; s?: string; v?: 'yes' | 'no' | 'neu' } }): Metadata {
  const languages: Record<string, string> = {};
  if (en || hi) {
    languages['en-IN'] = en ?? path;
    if (hi) languages['hi-IN'] = hi;
    languages['x-default'] = en ?? path;
  }
  const ogUrl = `/og?t=${encodeURIComponent(og?.t ?? title)}${og?.s ? `&s=${encodeURIComponent(og.s)}` : ''}${og?.v ? `&v=${og.v}` : ''}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: Object.keys(languages).length ? languages : undefined },
    openGraph: { title, description, url: path, images: [{ url: ogUrl, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  };
}
