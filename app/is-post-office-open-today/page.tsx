import { Page } from '@/components/page';
import { SvcIcon } from '@/components/icons';
import { Crumb, Pill, Source, Share, Faq, JsonLd, faqLd, crumbLd } from '@/components/ui';
import { INDIAPOST, LAST_CHECKED, circleShort } from '@/lib/data';
import { todayIST, fmtLong, fmtMed, dow, addDays } from '@/lib/date';
import { meta } from '@/lib/meta';
import { webPageLd, qaLd } from '@/lib/ld';

export const revalidate = 300;
const PATH = '/is-post-office-open-today';
type S = 'closed' | 'open' | 'sat';
function circleDay(c: string, d: string): { s: S; n?: string } {
  const h = INDIAPOST.circles[c]?.find((x) => x.d === d);
  if (h) return { s: 'closed', n: h.n };
  if (dow(d) === 0) return { s: 'closed', n: 'Sunday' };
  if (dow(d) === 6) return { s: 'sat' };
  return { s: 'open' };
}
function summary(d: string) {
  const circles = Object.keys(INDIAPOST.circles).filter((c) => c !== 'All India');
  const rows = circles.map((c) => ({ c, ...circleDay(c, d) }));
  const all = INDIAPOST.circles['All India'].find((x) => x.d === d);
  const closed = rows.filter((r) => r.s === 'closed');
  let a: string;
  if (!d.startsWith('2026')) a = `India Post has not published circle lists for ${d.slice(0, 4)} yet.`;
  else if (dow(d) === 0) a = `No, post offices across India are closed today, ${fmtLong(d)} (Sunday). Some head post offices may run limited counters — check locally.`;
  else if (all) a = `No, post offices across India are closed today, ${fmtLong(d)}, for ${all.n} — it is on India Post’s All-India holiday list.`;
  else if (closed.length) a = `Mostly yes. Post offices are open today, ${fmtLong(d)}, except in ${closed.map((r) => circleShort(r.c)).join(', ')}, where India Post lists a circle holiday (${[...new Set(closed.map((r) => r.n))].join('; ')}).`;
  else if (dow(d) === 6) a = `Today, ${fmtLong(d)}, is a Saturday and not on any India Post holiday list. Saturday hours vary by office, so check your local post office.`;
  else a = `Yes, post offices are open across India today, ${fmtLong(d)}. No India Post circle lists a holiday.`;
  return { rows, closed, all, a };
}
export async function generateMetadata() {
  const t = todayIST();
  const { a } = summary(t);
  return meta({
    title: `Is the Post Office Open Today? ${fmtMed(t)} — India Post Circle-wise Status`,
    description: `${a.split('. ')[0]}. Circle-wise status from the India Post holidays list, plus tomorrow.`.slice(0, 300),
    path: PATH,
    og: { t: 'Post office today', s: fmtMed(t) },
  });
}
const faq = [
  { q: 'Is the post office open on Saturday?', a: 'Saturdays are not on India Post’s holiday list. Hours vary by office, so confirm Saturday timings with your local post office.' },
  { q: 'Do post offices follow bank holidays?', a: 'No. India Post publishes its own All-India list and a list for each postal circle. Many bank holidays are not postal holidays.' },
  { q: 'Which list applies to my city?', a: 'The list of your postal circle. Chandigarh uses the Punjab Circle list and Goa uses the Maharashtra Circle list.' },
];
export default function P() {
  const t = todayIST();
  const { rows, a } = summary(t);
  const tm = addDays(t, 1);
  const ts = summary(tm);
  return (
    <Page>
      <JsonLd data={[
        webPageLd({ name: 'Is the post office open today?', path: PATH, basedOn: [INDIAPOST.source] }),
        qaLd({ q: `Is the post office open today (${fmtLong(t)})?`, a, path: PATH }),
        faqLd(faq),
        crumbLd([{ name: 'Home', path: '/' }, { name: 'Post office today', path: PATH }]),
      ]} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { label: 'Post office today' }]} />
          <section className="card hero" aria-labelledby="ans">
            <SvcIcon s="post" size="lg" />
            <h1 className="qh">Is the post office open today?</h1>
            <p className="big" id="ans">Post offices in India</p>
            <div className="statusrow"><span className="dt t">{fmtLong(t)}</span></div>
            <p className="answer"><b>{a.split('. ')[0]}.</b> {a.split('. ').slice(1).join('. ')} (<a href={INDIAPOST.source} rel="noopener">India Post holidays list</a>). Post offices follow their own list, not the bank holiday list.</p>
          </section>
          <Source tag="India Post" checked={LAST_CHECKED}><a href={INDIAPOST.source} rel="noopener">Holidays list 2026</a>, All-India and {rows.length} circles</Source>
          <div className="sech"><h2>By postal circle</h2><span className="t">{fmtMed(t)}</span></div>
          <div className="card list">
            {rows.map((r) => (
              <div className="row" key={r.c}><div className="nm"><b>{circleShort(r.c)}</b>{r.c.includes('(') ? <small>{r.c.match(/\((.*)\)/)?.[1]?.trim()}</small> : null}{r.n ? <small>{r.n}</small> : null}</div>
                <Pill v={r.s === 'closed' ? 'no' : r.s === 'sat' ? 'neu' : 'yes'} size="xs">{r.s === 'closed' ? 'Closed' : r.s === 'sat' ? 'Not a holiday' : 'Open'}</Pill></div>
            ))}
          </div>
          <p className="note"><b>Tomorrow ({fmtMed(tm)}):</b> {ts.a}</p>
          <Share text={`Is the post office open today? (${fmtMed(t)})`} path={PATH} />
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
          <p className="footsrc"><a href="/post-office-holidays-2026">Post office holidays 2026</a> · <a href="/mumbai/post-office">Mumbai</a> · <a href="/delhi/post-office">Delhi</a> · <a href="/bank-holiday-today">Bank holiday today</a></p>
        </div>
        <aside className="side"><div className="card panel"><div className="top"><h2>Check your city</h2></div>
          {['mumbai', 'delhi', 'bengaluru', 'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad'].map((c) => <div className="prow" key={c}><a href={`/${c}/post-office`}>{c[0].toUpperCase() + c.slice(1)}</a></div>)}
        </div></aside>
      </div>
    </Page>
  );
}
