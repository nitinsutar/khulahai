import type { Lang } from '@/lib/lang';
import { cityName, citiesForLang, prefix, LANG_NAME, HTML_LANG, type Alt } from '@/lib/lang';
import { t as tx } from '@/lib/copy';
import { IArrow, IBack, ICal, IPin, IWa } from './icons';
import { CITIES } from '@/lib/places';
import { abs } from '@/lib/site';
import { dayNum, fmtDow } from '@/lib/date';

export function Pill({ v, children, size = '' }: { v: 'yes' | 'no' | 'neu'; children: React.ReactNode; size?: string }) {
  return <span className={`pill ${size} ${v}`}><i aria-hidden="true" />{children}</span>;
}
export function Crumb({ items, lang = 'en' }: { items: { href?: string; label: string }[]; lang?: Lang }) {
  return (
    <nav className="crumb" aria-label={tx(lang, 'crumb')}>
      <IBack />
      {items.map((it, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? <a href={it.href}>{it.label}</a> : <b aria-current="page">{it.label}</b>}
        </span>
      ))}
    </nav>
  );
}
export function Source({ tag, children, checked, lang = 'en' }: { tag: string; children: React.ReactNode; checked: string; lang?: Lang }) {
  return (
    <div className="srcrow">
      <div className="source"><span className="tag">{tag}</span><span>{children}</span></div>
      <span className="checked t">{tx(lang, 'lastChecked')}: {checked}</span>
    </div>
  );
}
export function DTile({ iso, lang = 'en', no = false }: { iso: string; lang?: Lang; no?: boolean }) {
  return <div className={`dtile${no ? ' no' : ''}`}><b>{dayNum(iso)}</b><span>{fmtDow(iso, lang)}</span></div>;
}
export function Go() {
  return <span className="go" aria-hidden="true"><IArrow /></span>;
}
export function Share({ text, path, lang = 'en', ics }: { text: string; path: string; lang?: Lang; ics?: { href: string; label?: string } }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(text + ' ' + abs(path))}`;
  return (
    <div className="actions">
      {ics && <a className="btn pri" href={ics.href} download><ICal />{ics.label ?? (tx(lang, 'addCal'))}</a>}
      <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer"><IWa />{tx(lang, 'shareWa')}</a>
    </div>
  );
}
export function CitySwitcher({ current, lang = 'en', base = 'hub' }: { current?: string; lang?: Lang; base?: 'hub' | 'bank' | 'post-office' }) {
  const pre = prefix(lang);
  const list = citiesForLang(lang);
  const href = (s: string) => (base === 'hub' ? (lang === 'en' ? `/${s}` : `${pre}/${s}/bank`) : `${pre}/${s}/${base}`);
  const cur = list.find((c) => c.slug === current) ?? CITIES.find((c) => c.slug === current);
  return (
    <details className="cs">
      <summary><IPin />{cur ? <span className="csn">{cityName(cur, lang) + ' · '}</span> : null}{tx(lang, 'changeCity')}</summary>
      <div className="menu">
        <p>{tx(lang, 'pickCity')}</p>
        <div className="grid">
          {[...list].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
            <a key={c.slug} href={href(c.slug)} className={c.slug === current ? 'on' : ''}>{cityName(c, lang)}</a>
          ))}
        </div>
      </div>
    </details>
  );
}
export function LangLinks({ alts, lang }: { alts: Alt[]; lang: Lang }) {
  const rest = alts.filter((a) => a.lang !== lang);
  if (!rest.length) return null;
  return (
    <>
      {rest.map((a, i) => (
        <span key={a.lang}>
          {i > 0 ? ' · ' : null}
          <a href={a.href} hrefLang={HTML_LANG[a.lang]} lang={HTML_LANG[a.lang]}>{LANG_NAME[a.lang]}</a>
        </span>
      ))}
    </>
  );
}
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="card faq">
      {items.map((f, i) => (
        <details key={i} open={i === 0}><summary>{f.q}</summary><div className="an">{f.a}</div></details>
      ))}
    </div>
  );
}
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export const faqLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const crumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: abs(x.path) })),
});
export const holidayListLd = (name: string, path: string, items: { d: string; n: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'ItemList', name, url: abs(path), numberOfItems: items.length,
  itemListElement: items.map((h, i) => ({ '@type': 'ListItem', position: i + 1, name: `${h.d}: ${h.n}` })),
});
