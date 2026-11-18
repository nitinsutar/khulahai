import type { Metadata } from 'next';
export function meta({ title, description, path, en, hi, languages, og }: { title: string; description: string; path: string; en?: string; hi?: string; languages?: Record<string, string>; og?: { t: string; s?: string; v?: 'yes' | 'no' | 'neu' } }): Metadata {
  let langs: Record<string, string> | undefined;
  if (languages && Object.keys(languages).length) langs = languages;
  else if (en || hi) {
    langs = { 'en-IN': en ?? path, 'x-default': en ?? path };
    if (hi) langs['hi-IN'] = hi;
  }
  const ogUrl = `/og?t=${encodeURIComponent(og?.t ?? title)}${og?.s ? `&s=${encodeURIComponent(og.s)}` : ''}${og?.v ? `&v=${og.v}` : ''}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: langs },
    openGraph: { title, description, url: path, images: [{ url: ogUrl, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  };
}
