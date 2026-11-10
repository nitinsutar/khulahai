import { STATES, stateBySlug, CITIES } from '@/lib/places';
import { stateHolidays, saturdaysOff, RBI, LAST_CHECKED, officesClosedOn, bankDay, cityHolidays } from '@/lib/data';
import { addDays, dow, fmtLong, fmtMed, monthName, monthNum, MONTHS, dayNum } from '@/lib/date';
import { shortName } from '@/lib/names';
import { T } from '@/lib/text';
import { SvcIcon } from './icons';
import { Crumb, DTile, Pill, Share, Source } from './ui';

export function StateGrid({ hrefFor, current }: { hrefFor: (s: string) => string; current?: string }) {
  return (
    <div className="stategrid">
      {STATES.map((s) => (
        <a key={s.slug} className="card" href={hrefFor(s.slug)} aria-current={s.slug === current ? 'page' : undefined} style={s.slug === current ? { borderColor: 'var(--accent)' } : undefined}>
          {s.name}<small>{s.code}</small>
        </a>
      ))}
    </div>
  );
}

export function MonthCal({ year, month, holidays, today, nav }: { year: number; month: number; holidays: Set<string>; today: string; nav?: { prev?: string; next?: string } }) {
  const first = `${year}-${String(month).padStart(2, '0')}-01`;
  const lead = dow(first);
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = first; monthNum(d) === month; d = addDays(d, 1)) cells.push(d);
  return (
    <div className="card cal">
      <div className="mon">
        {nav?.prev ? <a href={nav.prev} aria-label="Previous month">‹</a> : <span style={{ width: 32 }} />}
        <span>{monthName(month)} <span className="t">{year}</span></span>
        {nav?.next ? <a href={nav.next} aria-label="Next month">›</a> : <span style={{ width: 32 }} />}
      </div>
      <div className="cdow" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
      <div className="cgrid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const hol = holidays.has(d);
          const wk = !hol && (dow(d) === 0 || (dow(d) === 6 && [2, 4].includes(Math.ceil(dayNum(d) / 7))));
          const cls = `cell${d === today ? ' today' : hol ? ' hol' : wk ? ' wk' : ''}`;
          return <span key={d} className={cls} title={hol ? 'Bank holiday' : wk ? 'Weekly off' : undefined}>{dayNum(d)}</span>;
        })}
      </div>
    </div>
  );
}

export function StateYear({ slug, today }: { slug: string; today: string }) {
  const st = stateBySlug(slug)!;
  const list = stateHolidays(slug);
  const multi = st.offices.length > 1;
  const curM = today.startsWith('2026') ? monthNum(today) : 12;
  const upcoming = list.filter((h) => h.d >= today);
  const cities = CITIES.filter((c) => c.state === slug);
  return (
    <div className="layout narrow">
      <div>
        <Crumb items={[{ href: '/', label: 'Home' }, { href: '/bank-holidays-2026', label: 'Bank holidays 2026' }, { label: st.name }]} />
        <div className="phero"><SvcIcon s="bank" size="lg" /><div><div className="e">Banks · {st.name}</div><h1>Bank holidays 2026 in {st.name}</h1></div></div>
        <p className="lead">
          {list.length} RBI holidays in {st.name} in 2026, plus every Sunday and the 2nd and 4th Saturday.{' '}
          {upcoming.length ? <>Next: <b className="t">{fmtMed(upcoming[0].d)}</b>, {shortName(upcoming[0].n)}.</> : 'No festival holidays left this year.'}
          {multi && <> {st.name} has {st.offices.length} RBI offices ({st.offices.map((o) => RBI.offices[o].name).join(', ')}); days that apply only to some are marked.</>}
        </p>
        <MonthCal year={2026} month={curM} holidays={new Set(list.map((h) => h.d))} today={today} />
        <div className="legend"><span><i className="hol" />Festival holiday</span><span><i className="wk" />Sunday / 2nd &amp; 4th Saturday</span><span><i className="td" />Today</span></div>
        <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">Holiday Matrix</a> · {st.offices.map((o) => RBI.offices[o].name).join(', ')}</Source>
        <Share text={`Bank holidays 2026 in ${st.name}`} path={`/bank-holidays-2026/${slug}`} ics={{ href: `/ics/bank-${slug}-2026.ics` }} />
        <div className="sech"><h2>All {st.name} bank holidays 2026</h2><span><span className="t">{list.length}</span> days</span></div>
        <div className="card list">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const rows = list.filter((h) => monthNum(h.d) === m);
            if (!rows.length) return null;
            return (
              <div key={m}>
                <div className="monthh"><a href={`/bank-holidays/${MONTHS[m - 1]}-2026`}>{monthName(m)}</a><span>{rows.length}</span></div>
                {rows.map((h) => (
                  <div className={`row${h.d < today ? ' past' : ''}${h.d === today ? ' today' : ''}`} key={h.d}>
                    <DTile iso={h.d} no={h.d >= today} />
                    <div className="nm">{shortName(h.n)}<small>{h.n !== shortName(h.n) ? h.n : fmtLong(h.d)}{multi && !h.all ? ` · only ${h.offices.join(', ')}` : ''}</small></div>
                    <Pill v={h.d < today ? 'neu' : 'no'} size="xs">{h.d < today ? 'Past' : h.d === today ? 'Today' : 'Closed'}</Pill>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <p className="footsrc">The RBI list covers holidays under the Negotiable Instruments Act. Sundays and the 2nd/4th Saturday are extra weekly closures. Names are RBI’s; we add a short label for readability.</p>
      </div>
      <aside className="side">
        {cities.length > 0 && (
          <div className="card panel">
            <div className="top"><h2>Is the bank open today?</h2></div>
            {cities.map((c) => {
              const s = bankDay(cityHolidays(c), today);
              return <div className="prow" key={c.slug}><a href={`/${c.slug}/bank`}>{c.name}</a><Pill v={s.open ? 'yes' : 'no'} size="xs">{s.open ? 'Open' : 'Closed'}</Pill></div>;
            })}
          </div>
        )}
        <div className="card panel"><div className="top"><h2>Other states</h2></div><a className="lnk" href="/bank-holidays-2026">All 28 states &amp; UTs →</a></div>
      </aside>
    </div>
  );
}

export function MonthAll({ month, today, h1 }: { month: number; today: string; h1?: string }) {
  const first = `2026-${String(month).padStart(2, '0')}-01`;
  const days: string[] = [];
  for (let d = first; monthNum(d) === month; d = addDays(d, 1)) days.push(d);
  const rows = days.map((d) => ({ d, offices: officesClosedOn(d) })).filter((x) => x.offices.length);
  const sats = saturdaysOff().filter((d) => monthNum(d) === month);
  const allSet = new Set(rows.filter((r) => r.offices.length === 34).map((r) => r.d));
  return (
    <div className="layout narrow">
      <div>
        <Crumb items={[{ href: '/', label: 'Home' }, { href: '/bank-holidays-2026', label: 'Bank holidays 2026' }, { label: `${monthName(month)} 2026` }]} />
        <div className="phero"><SvcIcon s="bank" size="lg" /><div><div className="e">Banks · All India</div><h1>{h1 ?? `Bank holidays in ${monthName(month)} 2026`}</h1></div></div>
        <p className="lead">{rows.length} days in {monthName(month)} 2026 with an RBI holiday somewhere in India, plus {sats.length} bank Saturdays off ({sats.map((d) => fmtMed(d)).join(', ')}) and every Sunday. Check your state below — most holidays are regional.</p>
        <div className="tabs" role="navigation" aria-label="Months">
          {MONTHS.map((m, i) => <a key={m} href={`/bank-holidays/${m}-2026`} className={i + 1 === month ? 'on' : ''}>{monthName(i + 1).slice(0, 3)}</a>)}
        </div>
        <MonthCal year={2026} month={month} holidays={allSet} today={today} nav={{ prev: month > 1 ? `/bank-holidays/${MONTHS[month - 2]}-2026` : undefined, next: month < 12 ? `/bank-holidays/${MONTHS[month]}-2026` : undefined }} />
        <div className="legend"><span><i className="hol" />Holiday at all RBI centres</span><span><i className="wk" />Sunday / 2nd &amp; 4th Saturday</span></div>
        <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">Holiday Matrix</a>, all 34 regional offices</Source>
        <div className="card tblwrap">
          <table className="tbl">
            <caption className="sr">Bank holidays in {monthName(month)} 2026 by RBI centre</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Holiday</th><th scope="col">Banks closed in</th></tr></thead>
            <tbody>
              {rows.map((r) => {
                const names = [...new Set(r.offices.map((o) => shortName(o.h.n)))];
                return (
                  <tr key={r.d} style={r.d < today ? { opacity: 0.6 } : undefined}>
                    <td className="t" style={{ whiteSpace: 'nowrap' }}><b>{fmtMed(r.d)}</b></td>
                    <td>{names.join('; ')}</td>
                    <td>{r.offices.length === 34 ? <b>All of India</b> : r.offices.map((o, i) => <span key={o.slug}>{i ? ', ' : ''}<a href={`/bank-holidays-2026/${o.state.slug}`} style={{ textDecoration: 'underline' }}>{o.name}</a></span>)}<small>{r.offices.length} of 34 centres</small></td>
                  </tr>
                );
              })}
              {sats.map((d) => (
                <tr key={d}><td className="t"><b>{fmtMed(d)}</b></td><td>{Math.ceil(dayNum(d) / 7) === 2 ? 'Second' : 'Fourth'} Saturday</td><td><b>All of India</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Share text={`Bank holidays in ${monthName(month)} 2026`} path={`/bank-holidays/${MONTHS[month - 1]}-2026`} />
      </div>
      <aside className="side">
        <div className="card panel"><div className="top"><h2>Pick your state</h2></div>
          <StateGridMini />
        </div>
      </aside>
    </div>
  );
}
function StateGridMini() {
  return <>{STATES.map((s) => <div className="prow" key={s.slug}><a href={`/bank-holidays-2026/${s.slug}`}>{s.name}</a><span className="k">{s.code}</span></div>)}</>;
}

export function TodayAll({ day, label, today }: { day: string; label: 'today' | 'tomorrow'; today: string }) {
  const closed = officesClosedOn(day);
  const base = bankDay([], day);
  const isTomorrow = label === 'tomorrow';
  const tc = CITIES.map((c) => ({ c, s: bankDay(cityHolidays(c), day) }));
  return (
    <div className="layout narrow">
      <div>
        <Crumb items={[{ href: '/', label: 'Home' }, { label: isTomorrow ? 'Bank holiday tomorrow' : 'Bank holiday today' }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="bank" size="lg" />
          <p className="q">{isTomorrow ? 'Is tomorrow a bank holiday?' : 'Is today a bank holiday?'}</p>
          <h1 id="ans">{isTomorrow ? 'Bank holiday tomorrow' : 'Bank holiday today'}</h1>
          <div className="statusrow">
            {!base.open ? <Pill v="no" size="lg">Closed across India</Pill> : closed.length ? <Pill v="no" size="lg">Closed in {closed.length} of 34 centres</Pill> : <Pill v="yes" size="lg">Open across India</Pill>}
            <span className="dt t">{fmtLong(day)}</span>
          </div>
          <p className="reason">
            {!base.open ? (base.reason.kind === 'sunday' ? 'It’s a Sunday — banks are closed everywhere.' : `It’s the ${base.reason.kind === 'saturday2' ? 'second' : 'fourth'} Saturday — banks are closed everywhere in India.`) : closed.length ? `Banks are closed ${isTomorrow ? 'tomorrow' : 'today'} only in the places listed below. Everywhere else, branches are open as usual.` : `No RBI holiday at any of the 34 centres ${isTomorrow ? 'tomorrow' : 'today'}. Banks are open across India.`}
          </p>
        </section>
        <Source tag="RBI" checked={LAST_CHECKED}><a href={RBI.source} rel="noopener">Holiday Matrix</a>, all regional offices</Source>
        {closed.length > 0 && (
          <>
            <div className="sech"><h2>Banks closed {isTomorrow ? 'tomorrow' : 'today'}</h2><span>{closed.length} centres</span></div>
            <div className="card list">
              {closed.map((o) => (
                <div className="row" key={o.slug}>
                  <div className="nm"><a href={`/bank-holidays-2026/${o.state.slug}`}><b>{o.name}</b></a> · {o.state.name}<small>{shortName(o.h.n)}{o.h.n !== shortName(o.h.n) ? ` — RBI: ${o.h.n}` : ''}</small></div>
                  <Pill v="no" size="xs">Closed</Pill>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="sech"><h2>Major cities</h2><span className="t">{fmtMed(day)}</span></div>
        <div className="card else">
          <div className="chips">
            {tc.map(({ c, s }) => <a key={c.slug} className={s.open ? 'y' : 'n'} href={`/${c.slug}/bank`}><i aria-hidden="true" />{c.name} <em>{s.open ? 'Open' : 'Closed'}</em></a>)}
          </div>
        </div>
        <Share text={`${isTomorrow ? 'Bank holiday tomorrow' : 'Bank holiday today'} (${fmtMed(day)})`} path={isTomorrow ? '/bank-holiday-tomorrow' : '/bank-holiday-today'} />
        <p className="footsrc">{isTomorrow ? <a href="/bank-holiday-today">Bank holiday today →</a> : <a href="/bank-holiday-tomorrow">Bank holiday tomorrow →</a>} · <a href="/saturday-bank-holiday">Saturday rules</a> · <a href="/bank-holiday-this-month">This month</a></p>
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>Next 7 days</h2></div>
          {Array.from({ length: 7 }, (_, i) => addDays(today, i + 1)).map((d) => {
            const b = bankDay([], d);
            const n = officesClosedOn(d).length;
            return <div className="prow" key={d}><span className="t">{fmtMed(d)}<small>{!b.open ? (b.reason.kind === 'sunday' ? 'Sunday' : 'Bank Saturday') : n ? `${n} centres closed` : 'Open everywhere'}</small></span><Pill v={!b.open ? 'no' : n ? 'neu' : 'yes'} size="xs">{!b.open ? 'All closed' : n ? 'Some closed' : 'Open'}</Pill></div>;
          })}
        </div>
      </aside>
    </div>
  );
}
