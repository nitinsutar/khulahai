import type { City } from './places';
import { CITIES, cityBySlug, stateBySlug } from './places';

// Language helpers for English, Hindi, and the extra today-page locales (Marathi, Gujarati, Bengali).
export type Lang = 'en' | 'hi' | 'mr' | 'gu' | 'bn';

export const LANGS: Lang[] = ['en', 'hi', 'mr', 'gu', 'bn'];
export const BCP47: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', hi: 'hi', mr: 'mr', gu: 'gu', bn: 'bn' };
export const PREFIX: Record<Lang, string> = { en: '', hi: '/hi', mr: '/mr', gu: '/gu', bn: '/bn' };
export const LANG_TAG: Record<Lang, string> = { en: 'EN', hi: 'हिं', mr: 'मरा', gu: 'ગુ', bn: 'বাং' };
export const LANG_NAME: Record<Lang, string> = { en: 'English', hi: 'हिंदी', mr: 'मराठी', gu: 'ગુજરાતી', bn: 'বাংলা' };

export const TODAY_PATH: Record<Lang, string> = {
  en: '/bank-holiday-today',
  hi: '/hi/aaj-bank-khula-hai',
  mr: '/mr/aaj-bank-chalu-aahe-ka',
  gu: '/gu/aaje-bank-khulli-chhe',
  bn: '/bn/ajk-ki-bank-khola-thakbe',
};

export const LOCALIZED_CITIES: Record<'mr' | 'gu' | 'bn', readonly string[]> = {
  mr: ['mumbai', 'pune', 'thane'],
  gu: ['ahmedabad', 'surat'],
  bn: ['kolkata'],
};

const CITY_NATIVE: Record<string, Partial<Record<Lang, { name: string; in: string }>>> = {
  mumbai: { mr: { name: 'मुंबई', in: 'मुंबईत' } },
  pune: { mr: { name: 'पुणे', in: 'पुण्यात' } },
  thane: { mr: { name: 'ठाणे', in: 'ठाण्यात' } },
  ahmedabad: { gu: { name: 'અમદાવાદ', in: 'અમદાવાદમાં' } },
  surat: { gu: { name: 'સુરત', in: 'સુરતમાં' } },
  kolkata: { bn: { name: 'কলকাতা', in: 'কলকাতায়' } },
};

const STATE_NATIVE: Record<string, Partial<Record<Lang, string>>> = {
  maharashtra: { mr: 'महाराष्ट्र' },
  gujarat: { gu: 'ગુજરાત' },
  'west-bengal': { bn: 'পশ্চিমবঙ্গ' },
};

export function cityName(city: City, lang: Lang): string {
  if (lang === 'hi') return city.hi;
  return CITY_NATIVE[city.slug]?.[lang]?.name ?? city.name;
}
export function cityIn(city: City, lang: Lang): string {
  if (lang === 'hi') return `${city.hi} में`;
  if (lang === 'en') return `in ${city.name}`;
  return CITY_NATIVE[city.slug]?.[lang]?.in ?? city.name;
}
export function stateName(stateSlug: string, lang: Lang): string {
  const st = stateBySlug(stateSlug);
  if (!st) return stateSlug;
  if (lang === 'hi') return st.hi;
  return STATE_NATIVE[stateSlug]?.[lang] ?? st.name;
}
export function prefix(lang: Lang): string {
  return PREFIX[lang];
}
export function cityPath(lang: Lang, slug: string, kind: 'bank' | 'post-office'): string {
  return `${PREFIX[lang]}/${slug}/${kind}`;
}
export function langsForCity(slug: string): Lang[] {
  const extra = (Object.keys(LOCALIZED_CITIES) as Array<'mr' | 'gu' | 'bn'>).filter((l) => LOCALIZED_CITIES[l].includes(slug));
  return ['en', 'hi', ...extra];
}
export function citiesForLang(lang: Lang): City[] {
  if (lang === 'en' || lang === 'hi') return CITIES;
  return LOCALIZED_CITIES[lang].map((s) => cityBySlug(s)!).filter(Boolean);
}
export function hasCityLang(slug: string, lang: Lang): boolean {
  return langsForCity(slug).includes(lang);
}

export type Alt = { lang: Lang; href: string };

export function todayAlts(): Alt[] {
  return LANGS.map((lang) => ({ lang, href: TODAY_PATH[lang] }));
}
export function cityAlts(slug: string, kind: 'bank' | 'post-office'): Alt[] {
  return langsForCity(slug).map((lang) => ({ lang, href: cityPath(lang, slug, kind) }));
}
export function hrefLangMap(alts: Alt[]): Record<string, string> {
  const languages: Record<string, string> = { 'x-default': alts.find((a) => a.lang === 'en')?.href ?? alts[0].href };
  for (const a of alts) languages[BCP47[a.lang]] = a.href;
  return languages;
}
