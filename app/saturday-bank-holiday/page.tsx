import { Page } from '@/components/page';
import { SvcIcon } from '@/components/icons';
import { Crumb, DTile, Pill, Source, Faq, JsonLd, faqLd, Share } from '@/components/ui';
import { saturdaysOff, bankDay, officesClosedOn, LAST_CHECKED, RBI } from '@/lib/data';
import { addDays, dow, fmtLong, fmtDM, monthName, monthNum, todayIST, dayNum } from '@/lib/date';
import { meta } from '@/lib/meta';

export const revalidate = 300;
export async function generateMetadata() {
  const t = todayIST();
  const sat = addDays(t, (6 - dow(t) + 7) % 7);
  const s = bankDay([], sat);
  return meta({
    title: `Is Saturday a bank holiday? This Saturday (${fmtDM(sat)}): banks ${s.open ? 'open' : 'closed'}`,
    description: 'Saturday bank holiday rule: banks close on the 2nd and 4th Saturday of every month. See if banks are open this Saturday and all bank Saturdays off in 2026.',
    path: '/saturday-bank-holiday',
    og: { t: 'Saturday bank holiday', s: `This Saturday: banks ${s.open ? 'open' : 'closed'}` },
  });
}
const faq = [
  { q: 'Are banks closed on all Saturdays?', a: 'No. Banks in India close only on the second and fourth Saturday of each month. They are open on the first, third and fifth Saturdays, unless that day is also an RBI holiday in your state.' },
  { q: 'Is the 5th Saturday a bank holiday?', a: 'No. A fifth Saturday is a normal working day for banks.' },
  { q: 'Do ATMs and UPI work on bank Saturdays?', a: 'Yes. ATMs, UPI, IMPS, NEFT and net banking keep working when branches are closed.' },
];
export default function P() {
  const t = todayIST();
  const sat = addDays(t, (6 - dow(t) + 7) % 7);
  const s = bankDay([], sat);
  const local = officesClosedOn(sat);
  const sats = saturdaysOff();
  return (
    <Page>
      <JsonLd data={faqLd(faq)} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { label: 'Saturday bank holiday' }]} />
          <section className="card hero" aria-labelledby="ans">
            <SvcIcon s="bank" size="lg" />
            <p className="q">Is this Saturday a bank holiday?</p>
            <h1 id="ans">{sat === t ? 'Today' : 'This Saturday'}, {fmtDM(sat)}</h1>
            <div className="statusrow"><Pill v={s.open ? 'yes' : 'no'} size="lg">{s.open ? 'Banks open' : 'Banks closed'}</Pill><span className="dt t">{fmtLong(sat)}</span></div>
            <p className="reason">{s.open ? `This is the ${['first', 'second', 'third', 'fourth', 'fifth'][Math.ceil(dayNum(sat) / 7) - 1]} Saturday of ${monthName(monthNum(sat))}, so banks are working.` : `This is the ${s.reason.kind === 'saturday2' ? 'second' : 'fourth'} Saturday of ${monthName(monthNum(sat))} — banks are closed across India.`}{s.open && local.length ? ` But it is an RBI holiday in ${local.map((l) => l.name).join(', ')}.` : ''}</p>
          </section>
          <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">“All scheduled and non-scheduled banks will observe public holiday on second and fourth Saturdays”</a></Source>
          <Share text={`This Saturday (${fmtDM(sat)}) banks are ${s.open ? 'open' : 'closed'}`} path="/saturday-bank-holiday" />
          <div className="sech"><h2>Bank Saturdays off in 2026</h2><span>{sats.length} days</span></div>
          <div className="card list">
            {sats.map((d) => <div className={`row${d < t ? ' past' : ''}`} key={d}><DTile iso={d} no={d >= t} /><div className="nm">{Math.ceil(dayNum(d) / 7) === 2 ? 'Second' : 'Fourth'} Saturday<small className="t">{fmtLong(d)}</small></div><Pill v={d < t ? 'neu' : 'no'} size="xs">{d < t ? 'Past' : 'Closed'}</Pill></div>)}
          </div>
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
        </div>
        <aside className="side"><div className="card panel"><div className="top"><h2>Next Saturdays</h2></div>
          {Array.from({ length: 6 }, (_, i) => addDays(sat, 7 * i)).map((d) => { const b = bankDay([], d); return <div className="prow" key={d}><span className="t">{fmtDM(d)}</span><Pill v={b.open ? 'yes' : 'no'} size="xs">{b.open ? 'Open' : 'Closed'}</Pill></div>; })}
        </div></aside>
      </div>
    </Page>
  );
}
