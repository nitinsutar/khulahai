import { abs, SITE_URL } from './site';
import { TZ } from './date';

export function nowIST(): string {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+05:30`;
}
export const ORG = { '@type': 'Organization', name: 'Khula Hai', url: SITE_URL };
export function webPageLd({ name, path, description, lang = 'en', basedOn = [], published = '2026-11-11T00:00:00+05:30' }: { name: string; path: string; description?: string; lang?: 'en' | 'hi'; basedOn?: string[]; published?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'WebPage', name, url: abs(path), description,
    inLanguage: lang === 'hi' ? 'hi-IN' : 'en-IN', isAccessibleForFree: true,
    datePublished: published, dateModified: nowIST(), publisher: ORG,
    ...(basedOn.length ? { isBasedOn: basedOn.length === 1 ? basedOn[0] : basedOn } : {}),
  };
}
export function qaLd({ q, a, path, lang = 'en' }: { q: string; a: string; path: string; lang?: 'en' | 'hi' }) {
  const t = nowIST();
  return {
    '@context': 'https://schema.org', '@type': 'QAPage', url: abs(path), inLanguage: lang === 'hi' ? 'hi-IN' : 'en-IN',
    mainEntity: { '@type': 'Question', name: q, text: q, answerCount: 1, dateCreated: t, author: ORG, acceptedAnswer: { '@type': 'Answer', text: a, dateCreated: t, url: abs(path), author: ORG } },
  };
}
export function datasetLd({ name, description, path, csv, temporal, basedOn }: { name: string; description: string; path: string; csv: string; temporal: string; basedOn: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'Dataset', name, description, url: abs(path), creator: ORG,
    license: 'https://creativecommons.org/licenses/by/4.0/', temporalCoverage: temporal, spatialCoverage: { '@type': 'Place', name: 'India' },
    isBasedOn: basedOn, dateModified: nowIST(), isAccessibleForFree: true,
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: abs(csv) }],
  };
}
