import { Page } from '@/components/page';
import { TodayAll } from '@/components/lists';
import { BankView, bankFaq } from '@/components/bank';
import { PostView, postFaq } from '@/components/post';
import { JsonLd, faqLd, crumbLd } from '@/components/ui';
import { todayIST, fmtDM } from '@/lib/date';
import { meta } from '@/lib/meta';
import { bankDay, cityHolidays, postDay, RBI } from '@/lib/data';
import { bankNationalMeta, bankCityMeta, postCityMeta, GNJ_2026 } from '@/lib/titles';
import { webPageLd } from '@/lib/ld';
import { notFound } from 'next/navigation';
import { cityBySlug } from '@/lib/places';
import type { Lang } from '@/lib/lang';
import { TODAY_PATH, cityPath, cityName, hasCityLang, citiesForLang, todayAlts, cityAlts, hrefLangMap } from '@/lib/lang';
import { t } from '@/lib/copy';

export function todayGenerateMetadata(lang: Lang) {
  return async () => {
    const day = todayIST();
    const m = bankNationalMeta(day, lang, 'today');
    return meta({ title: m.title, description: m.description, path: TODAY_PATH[lang], languages: hrefLangMap(todayAlts()), og: { t: m.title, s: fmtDM(day, lang), v: m.ogV } });
  };
}

export function TodayPage({ lang }: { lang: Lang }) {
  const day = todayIST();
  const path = TODAY_PATH[lang];
  return (
    <Page lang={lang} alts={todayAlts()}>
      <JsonLd data={[
        webPageLd({ name: t(lang, 'todayBankQ'), path, lang, basedOn: [RBI.source] }),
        crumbLd([{ name: t(lang, 'home'), path }, { name: t(lang, 'todayBankQ'), path }]),
      ]} />
      <TodayAll day={day} label="today" today={day} lang={lang} />
    </Page>
  );
}

export function cityParams(lang: Lang) {
  return () => citiesForLang(lang).map((c) => ({ city: c.slug }));
}

export function cityBankMetadata(lang: Lang) {
  return async ({ params }: { params: Promise<{ city: string }> }) => {
    const c = cityBySlug((await params).city)!;
    const day = todayIST();
    const s = bankDay(cityHolidays(c), day);
    const gnj = bankDay(cityHolidays(c), GNJ_2026);
    const m = bankCityMeta(c, day, s, lang, gnj);
    const path = cityPath(lang, c.slug, 'bank');
    return meta({ title: m.title, description: m.description, path, languages: hrefLangMap(cityAlts(c.slug, 'bank')), og: { t: m.title, s: m.title, v: m.ogV } });
  };
}

export async function CityBankPage({ lang, params }: { lang: Lang; params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c || !hasCityLang(c.slug, lang)) notFound();
  const day = todayIST();
  const path = cityPath(lang, c.slug, 'bank');
  return (
    <Page lang={lang} alts={cityAlts(c.slug, 'bank')}>
      <JsonLd data={[
        webPageLd({ name: bankCityMeta(c, day, bankDay(cityHolidays(c), day), lang).title, path, lang, basedOn: [RBI.source] }),
        faqLd(bankFaq(c, lang)),
        crumbLd([{ name: t(lang, 'home'), path: TODAY_PATH[lang] }, { name: cityName(c, lang), path }, { name: t(lang, 'banks'), path }]),
      ]} />
      <BankView city={c} today={day} lang={lang} />
    </Page>
  );
}

export function cityPostMetadata(lang: Lang) {
  return async ({ params }: { params: Promise<{ city: string }> }) => {
    const c = cityBySlug((await params).city)!;
    const day = todayIST();
    const p = postDay(c.state, day, cityHolidays(c));
    const m = postCityMeta(c, day, p, lang);
    const path = cityPath(lang, c.slug, 'post-office');
    return meta({ title: m.title, description: m.description, path, languages: hrefLangMap(cityAlts(c.slug, 'post-office')), og: { t: m.title, s: m.title, v: m.ogV } });
  };
}

export async function CityPostPage({ lang, params }: { lang: Lang; params: Promise<{ city: string }> }) {
  const c = cityBySlug((await params).city);
  if (!c || !hasCityLang(c.slug, lang)) notFound();
  const day = todayIST();
  const path = cityPath(lang, c.slug, 'post-office');
  return (
    <Page lang={lang} alts={cityAlts(c.slug, 'post-office')}>
      <JsonLd data={[
        faqLd(postFaq(c, lang)),
        crumbLd([{ name: t(lang, 'home'), path: TODAY_PATH[lang] }, { name: cityName(c, lang), path }, { name: t(lang, 'postOffice'), path }]),
      ]} />
      <PostView city={c} today={day} lang={lang} />
    </Page>
  );
}
