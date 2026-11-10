import { SvcIcon } from './icons';
import { Crumb, Pill, Faq, JsonLd, faqLd } from './ui';
export function Soon({ title, s, what, when, links }: { title: string; s: 'bank' | 'mkt'; what: string; when: string; links: { href: string; label: string }[] }) {
  const faq = [{ q: `When will the ${what} be released?`, a: when }, { q: 'Will this page update automatically?', a: 'Yes. We add the list here as soon as the official source publishes it, with the source and date checked.' }];
  return (
    <div className="layout narrow">
      <div>
        <JsonLd data={faqLd(faq)} />
        <Crumb items={[{ href: '/', label: 'Home' }, { label: title }]} />
        <div className="phero"><SvcIcon s={s} size="lg" /><div><div className="e">Coming soon</div><h1>{title}</h1></div></div>
        <div className="card soon">
          <Pill v="neu">Not published yet</Pill>
          <p className="lead" style={{ margin: '14px 0 0' }}>The official {what} has not been published yet. {when} We never guess dates — this page will show the full list once it is official.</p>
        </div>
        <div className="sech"><h2>Meanwhile</h2></div>
        <div className="card panel">{links.map((l) => <div className="prow" key={l.href}><a href={l.href}>{l.label}</a><span aria-hidden="true">→</span></div>)}</div>
        <div className="sech"><h2>Questions people ask</h2></div>
        <Faq items={faq} />
      </div>
    </div>
  );
}
