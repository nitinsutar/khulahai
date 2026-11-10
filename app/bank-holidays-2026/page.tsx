import { webPageLd, datasetLd } from '@/lib/ld';
import { Page } from '@/components/page';
import { StateGrid } from '@/components/lists';
import { SvcIcon } from '@/components/icons';
import { Crumb, DTile, Pill, Source, Faq, JsonLd, faqLd, holidayListLd } from '@/components/ui';
import { RBI, LAST_CHECKED, officesClosedOn } from '@/lib/data';
import { fmtLong, fmtMed, monthName, MONTHS, todayIST, addDays } from '@/lib/date';
import { shortName } from '@/lib/names';
import { meta } from '@/lib/meta';

export const revalidate = 3600;
export const metadata = meta({
  title: 'Bank Holidays 2026 India: State-wise RBI Holiday List + CSV',
  description: 'Bank holidays 2026 for every state from RBI’s holiday matrix — national holidays, state festivals, 2nd & 4th Saturdays, month-wise view and add-to-calendar files.',
  path: '/bank-holidays-2026',
  og: { t: 'Bank holidays 2026', s: 'State-wise · RBI holiday matrix' },
});
const faq = [
  { q: 'How many bank holidays are there in 2026?', a: 'It depends on your state. RBI lists between 15 and 28 holidays per regional office in 2026, on top of every Sunday and the 2nd and 4th Saturday of each month. Pick your state above for the exact list.' },
  { q: 'Which bank holidays apply to all of India?', a: 'Republic Day (26 January), Independence Day (15 August), Mahatma Gandhi Jayanti (2 October) and Christmas (25 December) are listed for every RBI centre. Most other holidays are state-specific.' },
  { q: 'Are SBI, HDFC and ICICI holidays the same?', a: 'Yes. All scheduled banks, public or private, follow the RBI holidays for the state they are in. There is no separate SBI holiday list.' },
  { q: 'Is the 2027 bank holiday list out?', a: 'Not yet. RBI usually publishes the next year’s holiday matrix in December. We will add it as soon as it is out.' },
];
export default function P() {
  const today = todayIST();
  const all = Object.values(RBI.offices)[0].holidays.filter((h) => Object.values(RBI.offices).every((o) => o.holidays.some((x) => x.d === h.d)));
  const next: { d: string; n: number; names: string[] }[] = [];
  for (let i = 1; i <= 45 && next.length < 8; i++) {
    const d = addDays(today, i);
    const c = officesClosedOn(d);
    if (c.length) next.push({ d, n: c.length, names: [...new Set(c.map((x) => shortName(x.h.n)))] });
  }
  return (
    <Page>
      <JsonLd data={[webPageLd({ name: 'Bank holidays 2026 in India', path: '/bank-holidays-2026', basedOn: [RBI.source] }), datasetLd({ name: 'RBI bank holidays 2026 by regional office', description: 'Bank holidays in 2026 for all 34 RBI regional offices (Negotiable Instruments Act holidays), as listed in RBI’s holiday matrix, with states mapped to offices.', path: '/bank-holidays-2026', csv: '/data/bank-holidays-2026.csv', temporal: '2026-01-01/2026-12-31', basedOn: RBI.source }), faqLd(faq), holidayListLd('Bank holidays common to all of India, 2026', '/bank-holidays-2026', all.map((h) => ({ d: h.d, n: shortName(h.n) })))]} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { label: 'Bank holidays 2026' }]} />
          <div className="phero"><SvcIcon s="bank" size="lg" /><div><div className="e">Banks · All India</div><h1>Bank holidays 2026</h1></div></div>
          <p className="lead">Pick your state for the full RBI list. Banks also close every Sunday and on the 2nd and 4th Saturday of every month.</p>
          <StateGrid hrefFor={(s) => `/bank-holidays-2026/${s}`} />
          <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">{RBI.title}</a></Source>
          <p className="footsrc" style={{ marginTop: 0 }}><a href="/data/bank-holidays-2026.csv" download>Download all 34 RBI centres as CSV</a> · Punjab &amp; Haryana use the RBI Chandigarh list (a mapping). Co-operative banks and RRBs may differ.</p>
          <div className="tabs" role="navigation" aria-label="Months">
            {MONTHS.map((m, i) => <a key={m} href={`/bank-holidays/${m}-2026`}>{monthName(i + 1)}</a>)}
          </div>
          <div className="sech"><h2>Coming up across India</h2><span>Next 45 days</span></div>
          <div className="card list">
            {next.map((x) => (
              <div className="row" key={x.d}><DTile iso={x.d} no /><div className="nm">{x.names.slice(0, 3).join('; ')}<small className="t">{fmtLong(x.d)} · {x.n === 34 ? 'all of India' : `${x.n} of 34 centres`}</small></div><a className="lnk" href={`/bank-holidays/${MONTHS[Number(x.d.slice(5, 7)) - 1]}-2026`}>Where →</a></div>
            ))}
          </div>
          <div className="sech"><h2>Holidays at every RBI centre</h2><span>{all.length} days</span></div>
          <div className="card list">
            {all.map((h) => <div className={`row${h.d < today ? ' past' : ''}`} key={h.d}><DTile iso={h.d} /><div className="nm">{shortName(h.n)}<small className="t">{fmtLong(h.d)}</small></div><Pill v={h.d < today ? 'neu' : 'no'} size="xs">{h.d < today ? 'Past' : 'Closed'}</Pill></div>)}
          </div>
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
        </div>
        <aside className="side">
          <div className="card panel"><div className="top"><h2>Quick answers</h2></div>
            <div className="prow"><a href="/bank-holiday-today">Bank holiday today</a><span className="k t">{fmtMed(today)}</span></div>
            <div className="prow"><a href="/bank-holiday-tomorrow">Bank holiday tomorrow</a></div>
            <div className="prow"><a href="/saturday-bank-holiday">Saturday bank holidays</a></div>
            <div className="prow"><a href="/bank-holiday-this-month">Bank holidays this month</a></div>
            <div className="prow"><a href="/sbi-holiday-list-2026">SBI holiday list 2026</a></div>
            <div className="prow"><a href="/bank-holidays-2027">2027 list</a><Pill v="neu" size="xs">Soon</Pill></div>
          </div>
        </aside>
      </div>
    </Page>
  );
}
