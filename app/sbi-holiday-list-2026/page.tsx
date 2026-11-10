import { Page } from '@/components/page';
import { StateGrid } from '@/components/lists';
import { SvcIcon } from '@/components/icons';
import { Crumb, Source, Faq, JsonLd, faqLd, DTile } from '@/components/ui';
import { LAST_CHECKED, RBI, officesClosedOn } from '@/lib/data';
import { addDays, fmtLong, todayIST } from '@/lib/date';
import { shortName } from '@/lib/names';
import { meta } from '@/lib/meta';

export const revalidate = 3600;
export const metadata = meta({
  title: 'SBI Holiday List 2026: State-wise Bank Holidays (RBI List)',
  description: 'SBI holiday list 2026 for every state. SBI branches follow the RBI holiday list for their state, plus the 2nd & 4th Saturdays and Sundays. Pick your state to see all dates.',
  path: '/sbi-holiday-list-2026',
  og: { t: 'SBI holiday list 2026', s: 'State-wise · RBI list' },
});
const faq = [
  { q: 'Does SBI have its own holiday list?', a: 'SBI branches follow the RBI holidays under the Negotiable Instruments Act for the state they are in, like every scheduled bank. So the SBI holiday list for your state is the RBI list for your state.' },
  { q: 'Is SBI open on Saturday?', a: 'SBI branches are closed on the 2nd and 4th Saturday of every month and open on the other Saturdays, unless it is a state holiday.' },
  { q: 'Do SBI YONO, UPI and ATMs work on holidays?', a: 'Yes. Digital banking, UPI and ATMs normally work on bank holidays. Only branch services are closed.' },
];
export default function P() {
  const t = todayIST();
  const next: { d: string; names: string[]; n: number }[] = [];
  for (let i = 0; i <= 30; i++) { const d = addDays(t, i); const c = officesClosedOn(d); if (c.length) next.push({ d, n: c.length, names: [...new Set(c.map((x) => shortName(x.h.n)))] }); }
  return (
    <Page>
      <JsonLd data={faqLd(faq)} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { href: '/bank-holidays-2026', label: 'Bank holidays 2026' }, { label: 'SBI holiday list 2026' }]} />
          <div className="phero"><SvcIcon s="bank" size="lg" /><div><div className="e">State Bank of India</div><h1>SBI holiday list 2026</h1></div></div>
          <p className="lead">SBI follows the RBI holiday list of each state, so your SBI branch is closed on the same days as every other bank in your state. Pick your state:</p>
          <StateGrid hrefFor={(s) => `/bank-holidays-2026/${s}`} />
          <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">Holiday Matrix</a> — applies to SBI and all scheduled banks</Source>
          <div className="sech"><h2>SBI branches closed in the next 30 days</h2><span>By number of RBI centres</span></div>
          <div className="card list">
            {next.map((x) => <div className="row" key={x.d}><DTile iso={x.d} no /><div className="nm">{x.names.slice(0, 3).join('; ')}<small className="t">{fmtLong(x.d)} · {x.n === 34 ? 'all of India' : `${x.n} of 34 centres`}</small></div></div>)}
          </div>
          <p className="footsrc">Plus the 2nd &amp; 4th Saturdays (<a href="/saturday-bank-holiday">see dates</a>) and every Sunday. Khula Hai is not affiliated with SBI.</p>
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
        </div>
        <aside className="side"><div className="card panel"><div className="top"><h2>Today</h2></div><a className="lnk" href="/bank-holiday-today">Is the bank open today? →</a></div></aside>
      </div>
    </Page>
  );
}
