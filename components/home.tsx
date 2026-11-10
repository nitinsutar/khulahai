import { City, stateBySlug, TOP_CITIES, cityBySlug } from '@/lib/places';
import { bankDay, cityHolidays, marketDay, nextBankOpen, nextFestivalHoliday, officesClosedOn, postDay, LAST_CHECKED, NSE, RBI } from '@/lib/data';
import { addDays, dow, fmtDMs, fmtLong, fmtMed } from '@/lib/date';
import { bankReason, bankShort, T } from '@/lib/text';
import { shortName } from '@/lib/names';
import { BANK_HOURS, POST_HOURS } from '@/lib/site';
import { SvcIcon } from './icons';
import { CitySwitcher, Go, Pill } from './ui';

export function HomeView({ city, today, lang = 'en', h1 }: { city: City; today: string; lang?: 'en' | 'hi'; h1?: string }) {
  const hi = lang === 'hi';
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const b = bankDay(hols, today);
  const y = bankDay(hols, addDays(today, -1));
  const m = marketDay(today);
  const p = postDay(city.state, today, hols);
  const nb = nextBankOpen(hols, today);
  const sat = addDays(today, (6 - dow(today) + 7) % 7);
  const satS = bankDay(hols, sat);
  const nf = nextFestivalHoliday(hols, today);
  const elsewhere = officesClosedOn(today);
  const cname = hi ? city.hi : city.name;
  const pre = hi ? '/hi' : '';
  const whyBank = b.open
    ? (y.reason.kind === 'holiday' ? (hi ? `नियमित कार्य दिवस। कल ${cname} में बैंक ${shortName(y.reason.rbi!, 'hi')} के लिए बंद थे।` : `Regular working day. Yesterday, ${city.name} banks were closed for ${shortName(y.reason.rbi!)}.`) : bankReason(b.reason, lang, hi ? st.hi : st.name))
    : bankReason(b.reason, lang, hi ? st.hi : st.name);

  return (
    <div className="layout">
      <div>
        <div className="dateline t">{fmtLong(today, lang)}</div>
        <div className="cityrow">
          <h1>{h1 ?? (hi ? `${cname} में आज` : `${city.name} today`)}</h1>
          <CitySwitcher current={city.slug} lang={lang} />
        </div>
        <div className="bento">
          <a className="card svc big" href={`${pre}/${city.slug}/bank`}>
            <div className="top"><SvcIcon s="bank" size="lg" /><Go /></div>
            <h2 className="name">{hi ? 'बैंक' : 'Banks'}</h2>
            <div><Pill v={b.open ? 'yes' : 'no'}>{b.open ? T.open(lang) : T.closed(lang)}</Pill></div>
            <p className="why">{whyBank}</p>
            <div className="meta">
              {b.open ? (
                <div><div className="k">{hi ? 'शाखा का सामान्य समय' : 'Typical branch hours'}</div><div className="v t">{BANK_HOURS}</div></div>
              ) : null}
              <div><div className="k">{hi ? 'अगला कार्य दिवस' : 'Next working day'}</div><div className="v t">{fmtMed(nb, lang)}</div></div>
            </div>
          </a>
          <a className="card svc small" href={hi ? '/hi/share-market' : '/is-share-market-open-today'}>
            <div className="top"><SvcIcon s="mkt" /><Go /></div>
            <h2 className="name">{hi ? 'शेयर बाज़ार' : 'Share market'}</h2>
            <div><Pill v={m.open ? 'yes' : 'no'}>{m.open ? T.open(lang) : T.closed(lang)}</Pill></div>
            <div className="hrs t">{m.open ? `${NSE.session.open}–${NSE.session.close}` : m.kind === 'holiday' ? m.name : (hi ? 'सप्ताहांत' : 'Weekend')}</div>
            <div className="sub">{hi ? 'NSE और BSE इक्विटी, IST' : 'NSE & BSE equity, IST'}</div>
          </a>
          <a className="card svc small" href={`${pre}/${city.slug}/post-office`}>
            <div className="top"><SvcIcon s="post" /><Go /></div>
            <h2 className="name">{hi ? 'डाकघर' : 'Post office'}</h2>
            <div><Pill v={p.state === 'closed' ? 'no' : p.state === 'check' ? 'neu' : 'yes'}>{p.state === 'closed' ? T.closed(lang) : p.state === 'check' ? (p.kind === 'saturday' ? (hi ? 'अवकाश नहीं' : 'Not a holiday') : hi ? 'स्थानीय रूप से जाँचें' : 'Check locally') : T.open(lang)}</Pill></div>
            <div className="hrs t">{p.state === 'closed' ? (p.kind === 'sunday' ? (hi ? 'रविवार' : 'Sunday') : hi ? p.hi : p.name) : POST_HOURS}</div>
            <div className="sub">{p.state === 'closed' ? (hi ? 'भारत डाक अवकाश' : 'India Post holiday') : p.kind === 'saturday' ? (hi ? 'शनिवार का समय कार्यालय अनुसार' : 'Saturday hours vary by office') : hi ? 'सामान्य काउंटर समय' : 'Typical counter hours'}</div>
          </a>
          <a className="card tile" href={hi ? `/hi/${city.slug}/bank` : '/saturday-bank-holiday'}>
            <div className="k">{sat === today ? (hi ? 'आज शनिवार' : 'Today, Saturday') : hi ? 'इस शनिवार' : 'This Saturday'}</div>
            <div className="big t">{fmtDMs(sat, lang)}</div>
            <div className="s">{satS.open ? <b className="yes">{hi ? 'बैंक खुले' : 'Banks open'}</b> : <b className="no">{hi ? 'बैंक बंद' : 'Banks closed'}</b>}<br />{bankShort(satS.reason, lang)}</div>
          </a>
          <a className="card tile" href={`/bank-holidays-2026/${city.state}`}>
            <div className="k">{hi ? 'अगली बैंक छुट्टी' : 'Next bank holiday'}</div>
            <div className="big t">{nf ? fmtDMs(nf.d, lang) : '—'}</div>
            <div className="s">{nf ? shortName(nf.n, lang) : hi ? '2026 में और नहीं' : 'None left in 2026'}{nf ? <><br />{hi ? st.hi : st.name}</> : null}</div>
          </a>
        </div>
        <div className="card else">
          <div className="top"><h2>{hi ? 'दूसरे शहरों में बैंक आज' : 'Banks in other cities today'}</h2><a className="lnk" href="/bank-holiday-today">{hi ? 'सभी केंद्र →' : 'All centres →'}</a></div>
          <div className="chips">
            {TOP_CITIES.map((s) => cityBySlug(s)!).map((c) => {
              const s = bankDay(cityHolidays(c), today);
              return (
                <a key={c.slug} className={s.open ? 'y' : 'n'} href={`${pre}/${c.slug}/bank`}><i aria-hidden="true" />{hi ? c.hi : c.name} <em>{s.open ? T.o(lang) : T.c(lang)}</em></a>
              );
            })}
          </div>
        </div>
        <p className="footsrc">
          {hi ? 'स्रोत: ' : 'Sources: '}<a href="https://rbi.org.in/Scripts/HolidayMatrixDisplay.aspx" rel="noopener">RBI Holiday Matrix</a> ({RBIname(city)}), <a href={NSE.source} rel="noopener">NSE</a> &amp; <a href={NSE.bseSource} rel="noopener">BSE</a> {hi ? 'परिपत्र' : 'circulars'}, <a href="https://www.indiapost.gov.in/holidays-list" rel="noopener">India Post</a>. {hi ? 'समय सामान्य हैं, आधिकारिक नहीं।' : 'Hours are typical, not official.'} <span className="t">{hi ? 'अंतिम जाँच' : 'Last checked'}: {LAST_CHECKED}</span>
        </p>
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>{hi ? 'आज कहाँ बैंक बंद हैं' : 'Banks closed elsewhere today'}</h2></div>
          {elsewhere.length === 0 ? (
            <p className="empty">{dow(today) === 0 ? (hi ? 'आज रविवार है — सभी बैंक बंद।' : 'It’s Sunday — all banks are closed.') : bankDay([], today).open ? (hi ? 'आज किसी भी आरबीआई केंद्र पर कोई त्योहार अवकाश नहीं है।' : 'No RBI festival holiday at any of the 34 centres today.') : (hi ? 'आज दूसरा/चौथा शनिवार है — पूरे भारत में बैंक बंद।' : 'It’s a 2nd/4th Saturday — banks are closed across India.')}</p>
          ) : (
            elsewhere.map((e) => (
              <div className="prow" key={e.slug}><span>{e.name}<small>{e.state.code} · {shortName(e.h.n, lang)}</small></span><Pill v="no" size="xs">{T.c(lang)}</Pill></div>
            ))
          )}
          <a className="lnk" href="/bank-holiday-today" style={{ display: 'inline-block', marginTop: 10 }}>{hi ? 'सभी 34 आरबीआई केंद्र देखें →' : 'See all 34 RBI centres →'}</a>
        </div>
        <div className="card panel">
          <div className="top"><h2>{hi ? 'कल' : 'Tomorrow'}</h2><span className="why t">{fmtMed(addDays(today, 1), lang)}</span></div>
          {(() => {
            const t = bankDay(hols, addDays(today, 1));
            const tm = marketDay(addDays(today, 1));
            const tp = postDay(city.state, addDays(today, 1), hols);
            return (
              <>
                <div className="prow"><span>{hi ? 'बैंक' : 'Banks'}<small>{bankShort(t.reason, lang)}</small></span><Pill v={t.open ? 'yes' : 'no'} size="xs">{t.open ? T.o(lang) : T.c(lang)}</Pill></div>
                <div className="prow"><span>{hi ? 'शेयर बाज़ार' : 'Share market'}</span><Pill v={tm.open ? 'yes' : 'no'} size="xs">{tm.open ? T.o(lang) : T.c(lang)}</Pill></div>
                <div className="prow"><span>{hi ? 'डाकघर' : 'Post office'}</span><Pill v={tp.state === 'closed' ? 'no' : tp.state === 'check' ? 'neu' : 'yes'} size="xs">{tp.state === 'closed' ? T.c(lang) : tp.state === 'check' ? (hi ? 'जाँचें' : 'Check') : T.o(lang)}</Pill></div>
              </>
            );
          })()}
          <a className="lnk" href="/bank-holiday-tomorrow" style={{ display: 'inline-block', marginTop: 10 }}>{hi ? 'कल कहाँ छुट्टी है →' : 'Bank holiday tomorrow →'}</a>
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}
function RBIname(c: City) {
  return RBI.offices[c.office].name;
}
