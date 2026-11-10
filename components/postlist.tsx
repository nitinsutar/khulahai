import { SvcIcon } from './icons';
import { Crumb, DTile, Pill, Source, Share, Faq, JsonLd, faqLd, holidayListLd, crumbLd } from './ui';
import { CENTRAL, LAST_CHECKED, INDIAPOST, circleShort } from '@/lib/data';
import { dow, fmtLong, fmtMed } from '@/lib/date';
import { webPageLd, datasetLd } from '@/lib/ld';

export function PostYear({ year, today }: { year: 2026 | 2027; today: string }) {
  const path = `/post-office-holidays-${year}`;
  const is26 = year === 2026;
  const all = is26 ? INDIAPOST.circles['All India'] : CENTRAL['2027'].holidays.filter((h) => h.c).map((h) => ({ d: h.d, n: h.n }));
  const allSet = new Set(all.map((h) => h.d));
  const circles = Object.entries(INDIAPOST.circles).filter(([k]) => k !== 'All India').sort((a, b) => a[0].localeCompare(b[0]));
  const faq = is26
    ? [
        { q: 'How many post office holidays are there in 2026?', a: `India Post’s All-India list has ${all.length} holidays in 2026. Each postal circle adds its own festivals, so most circles list 17 days. Post offices are also closed on Sundays.` },
        { q: 'Are post offices closed on the 2nd and 4th Saturday?', a: 'Saturdays are not on India Post’s holiday list — the 2nd/4th Saturday closure is a banking rule. Saturday hours vary by office, so confirm with your local post office.' },
        { q: 'Why is my post office open on a bank holiday?', a: 'Many bank holidays are state festivals that are not on the postal circle’s list, so post offices often stay open when banks are closed.' },
      ]
    : [
        { q: 'Is the India Post holiday list for 2027 out?', a: 'Not yet for postal circles. The central government (DoPT) list for 2027 is published, and its 14 compulsory holidays apply to all central government offices. Circle lists will be added when India Post publishes them.' },
      ];
  return (
    <>
      <JsonLd data={[
        webPageLd({ name: `Post office holidays ${year}`, path, basedOn: [is26 ? INDIAPOST.source : CENTRAL['2027'].pdf] }),
        faqLd(faq),
        holidayListLd(`Post office holidays ${year}`, path, all),
        crumbLd([{ name: 'Home', path: '/' }, { name: `Post office holidays ${year}`, path }]),
        ...(is26 ? [datasetLd({ name: 'India Post holidays 2026 by postal circle', description: 'All-India and circle-wise post office holidays for 2026 as published by India Post.', path, csv: '/data/post-office-holidays-2026.csv', temporal: '2026-01-01/2026-12-31', basedOn: INDIAPOST.source })] : []),
      ]} />
      <div className="layout narrow">
        <div>
          <Crumb items={[{ href: '/', label: 'Home' }, { label: `Post office holidays ${year}` }]} />
          <div className="phero"><SvcIcon s="post" size="lg" /><div><div className="e">Post office · All India</div><h1>Post office holidays {year}</h1></div></div>
          {is26 ? (
            <p className="lead">India Post publishes an All-India list ({all.length} days in 2026) and a list for each postal circle. Below: the All-India list, then the extra days each circle adds. Post offices are also closed on Sundays. This is not the same list as banks.</p>
          ) : (
            <p className="lead">India Post’s circle lists for 2027 are not out yet. These are the 14 compulsory central government holidays for 2027 from DoPT’s order of 16 July 2026, which apply to all central government offices. We will add circle lists once published.</p>
          )}
          <Source tag={is26 ? 'India Post' : 'DoPT'} checked={LAST_CHECKED}>{is26 ? <><a href={INDIAPOST.source} rel="noopener">indiapost.gov.in holidays list</a> (site updated {INDIAPOST.siteUpdated})</> : <a href={CENTRAL['2027'].pdf} rel="noopener">{CENTRAL['2027'].om}</a>}</Source>
          <Share text={`Post office holidays ${year}`} path={path} ics={{ href: `/ics/post-office-${year}.ics` }} />
          {is26 && <p className="footsrc" style={{ marginTop: 0, marginBottom: 10 }}><a href="/data/post-office-holidays-2026.csv" download>Download all circles as CSV</a></p>}
          <div className="sech"><h2>{is26 ? 'All-India postal holidays 2026' : 'Central government compulsory holidays 2027'}</h2><span>{all.length} days</span></div>
          <div className="card list">
            {all.map((h) => (
              <div className={`row${h.d < today ? ' past' : ''}`} key={h.d + h.n}>
                <DTile iso={h.d} no={h.d >= today} />
                <div className="nm">{h.n}<small className="t"><time dateTime={h.d}>{fmtLong(h.d)}</time>{dow(h.d) === 0 ? ' · Sunday' : dow(h.d) === 6 ? ' · Saturday' : ''}</small></div>
                <Pill v={h.d < today ? 'neu' : 'no'} size="xs">{h.d < today ? 'Past' : 'Closed'}</Pill>
              </div>
            ))}
          </div>
          {is26 && (
            <>
              <div className="sech"><h2>Extra holidays by postal circle</h2><span>{circles.length} circles</span></div>
              <div className="card tblwrap">
                <table className="tbl">
                  <caption className="sr">Post office holidays 2026 added by each India Post circle</caption>
                  <thead><tr><th scope="col">Circle</th><th scope="col">Extra holidays (beyond All-India)</th></tr></thead>
                  <tbody>
                    {circles.map(([c, list]) => (
                      <tr key={c}><td><b>{circleShort(c)}</b>{c.includes('(') && <small>{c.match(/\((.*)\)/)?.[1]}</small>}</td>
                        <td>{list.filter((h) => !allSet.has(h.d)).map((h, i) => <span key={h.d + i}>{i ? '; ' : ''}<time className="t" dateTime={h.d}>{fmtMed(h.d)}</time> {h.n}</span>)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="sech"><h2>Questions people ask</h2></div>
          <Faq items={faq} />
        </div>
        <aside className="side"><div className="card panel"><div className="top"><h2>Today</h2></div>
          <div className="prow"><a href="/is-post-office-open-today">Is the post office open today?</a></div>
          <div className="prow"><a href="/post-office-holidays-2026">2026 list</a></div><div className="prow"><a href="/post-office-holidays-2027">2027 (central govt)</a></div>
        </div></aside>
      </div>
    </>
  );
}
