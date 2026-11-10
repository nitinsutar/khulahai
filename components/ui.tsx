import { IArrow, IBack, ICal, IPin, IWa } from './icons';
import { CITIES } from '@/lib/places';
import { abs } from '@/lib/site';
import { dayNum, fmtDow } from '@/lib/date';

export function Pill({ v, children, size = '' }: { v: 'yes' | 'no' | 'neu'; children: React.ReactNode; size?: string }) {
  return <span className={`pill ${size} ${v}`}><i aria-hidden="true" />{children}</span>;
}
export function Crumb({ items, lang = 'en' }: { items: { href?: string; label: string }[]; lang?: 'en' | 'hi' }) {
  return (
    <nav className="crumb" aria-label={lang === 'hi' ? 'ब्रेडक्रम्ब' : 'Breadcrumb'}>
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
export function Source({ tag, children, checked, lang = 'en' }: { tag: string; children: React.ReactNode; checked: string; lang?: 'en' | 'hi' }) {
  return (
    <div className="srcrow">
      <div className="source"><span className="tag">{tag}</span><span>{children}</span></div>
      <span className="checked t">{lang === 'hi' ? 'अंतिम जाँच' : 'Last checked'}: {checked}</span>
    </div>
  );
}
export function DTile({ iso, lang = 'en', no = false }: { iso: string; lang?: 'en' | 'hi'; no?: boolean }) {
  return <div className={`dtile${no ? ' no' : ''}`}><b>{dayNum(iso)}</b><span>{fmtDow(iso, lang)}</span></div>;
}
export function Go() {
  return <span className="go" aria-hidden="true"><IArrow /></span>;
}
export function Share({ text, path, lang = 'en', ics }: { text: string; path: string; lang?: 'en' | 'hi'; ics?: { href: string; label?: string } }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(text + ' ' + abs(path))}`;
  return (
    <div className="actions">
      {ics && <a className="btn pri" href={ics.href} download><ICal />{ics.label ?? (lang === 'hi' ? 'कैलेंडर में जोड़ें (.ics)' : 'Add to calendar (.ics)')}</a>}
      <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer"><IWa />{lang === 'hi' ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}</a>
    </div>
  );
}
export function CitySwitcher({ current, lang = 'en', base = 'hub' }: { current?: string; lang?: 'en' | 'hi'; base?: 'hub' | 'bank' | 'post-office' }) {
  const pre = lang === 'hi' ? '/hi' : '';
  const href = (s: string) => (base === 'hub' ? (lang === 'hi' ? `/hi/${s}/bank` : `/${s}`) : `${pre}/${s}/${base}`);
  const cur = CITIES.find((c) => c.slug === current);
  return (
    <details className="cs">
      <summary><IPin />{cur ? <span className="csn">{(lang === 'hi' ? cur.hi : cur.name) + ' · '}</span> : null}{lang === 'hi' ? 'शहर बदलें' : 'Change'}<span className="csn">{lang === 'hi' ? '' : ' city'}</span></summary>
      <div className="menu">
        <p>{lang === 'hi' ? 'अपना शहर चुनें' : 'Pick your city'}</p>
        <div className="grid">
          {[...CITIES].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
            <a key={c.slug} href={href(c.slug)} className={c.slug === current ? 'on' : ''}>{lang === 'hi' ? c.hi : c.name}</a>
          ))}
        </div>
      </div>
    </details>
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
