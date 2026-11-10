import { City, stateBySlug } from '@/lib/places';
import { bankDay, cityHolidays, nextBankOpen, upcomingBankClosures, RBI, LAST_CHECKED, secondOrFourthSat } from '@/lib/data';
import { addDays, dow, fmtDM, fmtLong, fmtMed, monthName, monthNum } from '@/lib/date';
import { bankReason, bankShort, T } from '@/lib/text';
import { shortName } from '@/lib/names';
import { BANK_HOURS } from '@/lib/site';
import { SvcIcon } from './icons';
import { CitySwitcher, Crumb, DTile, Faq, Pill, Share, Source } from './ui';

export function bankFaq(city: City, lang: 'en' | 'hi') {
  const st = stateBySlug(city.state)!;
  if (lang === 'hi')
    return [
      { q: 'क्या आज ATM और UPI चलेंगे?', a: 'हाँ। यह जानकारी केवल बैंक शाखाओं के लिए है। छुट्टी के दिन भी ATM, UPI, IMPS और नेट बैंकिंग आमतौर पर चलते हैं।' },
      { q: 'क्या प्राइवेट बैंक भी बंद रहेंगे?', a: 'हाँ। परक्राम्य लिखत अधिनियम के तहत आरबीआई की छुट्टियाँ सभी अनुसूचित बैंकों पर लागू होती हैं — SBI, HDFC, ICICI, Axis, सहकारी बैंक आदि।' },
      { q: 'बैंक किन शनिवारों को बंद रहते हैं?', a: 'हर महीने के दूसरे और चौथे शनिवार को सभी बैंक बंद रहते हैं। पहले, तीसरे और पाँचवें शनिवार को बैंक खुले रहते हैं।' },
      { q: 'यह जानकारी कहाँ से आती है?', a: `आरबीआई की अवकाश तालिका (${RBI.offices[city.office].name} क्षेत्रीय कार्यालय) से। यह पेज हर दिन भारतीय समय के अनुसार अपने आप अपडेट होता है।` },
    ];
  return [
    { q: 'Are ATMs and UPI working on a bank holiday?', a: 'Yes. This status is for bank branches only. ATMs, UPI, IMPS and net banking usually keep working on bank holidays. NEFT and RTGS run 24×7.' },
    { q: 'Does this cover private banks like HDFC, ICICI and Axis?', a: 'Yes. RBI holidays under the Negotiable Instruments Act apply to all scheduled banks — public sector banks like SBI, private banks, and co-operative banks.' },
    { q: 'Which Saturdays are banks closed?', a: 'All banks close on the second and fourth Saturday of every month. The first, third and fifth Saturdays are working days.' },
    { q: `Where does the ${city.name} bank holiday list come from?`, a: `From the RBI Holiday Matrix for the ${RBI.offices[city.office].name} regional office, which covers ${st.name}${city.derived ? ` (${city.name} has no RBI office of its own, so we use this list)` : ''}. The page updates itself every day in Indian time.` },
  ];
}

export function BankView({ city, today, lang = 'en' }: { city: City; today: string; lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const b = bankDay(hols, today);
  const tm = bankDay(hols, addDays(today, 1));
  const y = bankDay(hols, addDays(today, -1));
  const nb = nextBankOpen(hols, today);
  const sat = addDays(today, (6 - dow(today) + 7) % 7);
  const satS = bankDay(hols, sat);
  const up = upcomingBankClosures(hols, addDays(today, 1), 40);
  const cname = hi ? city.hi : city.name;
  const where = hi ? st.hi : st.name;
  const sameMonthSats = (() => {
    const out: string[] = [];
    for (let d = sat; monthNum(d) === monthNum(sat); d = addDays(d, 7)) if (secondOrFourthSat(d) && d !== sat) out.push(d);
    return out;
  })();
  const faq = bankFaq(city, lang);
  const pre = hi ? '/hi' : '';
  const shareText = hi ? `${cname} में आज बैंक ${b.open ? 'खुले हैं' : 'बंद हैं'} (${fmtMed(today, 'hi')})` : `Banks in ${city.name} are ${b.open ? 'open' : 'closed'} today (${fmtMed(today)})`;
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { href: hi ? undefined : `/${city.slug}`, label: cname }, { label: hi ? 'बैंक' : 'Banks' }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="bank" size="lg" />
          <p className="q">{hi ? 'क्या आज बैंक खुला है?' : 'Is the bank open today?'}</p>
          <h1 id="ans">{hi ? `${cname} में बैंक` : `Banks in ${city.name}`}</h1>
          <div className="statusrow"><Pill v={b.open ? 'yes' : 'no'} size="lg">{b.open ? T.open(lang) : T.closed(lang)}</Pill><span className="dt t">{fmtLong(today, lang)}</span></div>
          <p className="reason">
            {bankReason(b.reason, lang, where)}
            {b.open && y.reason.kind === 'holiday' ? (hi ? ` कल ${shortName(y.reason.rbi!, 'hi')} के लिए बैंक बंद थे।` : ` Yesterday banks were closed for ${shortName(y.reason.rbi!)}.`) : ''}
            {b.reason.kind === 'holiday' && <small>RBI: {b.reason.rbi}</small>}
          </p>
          <div className="hrs">
            <div><div className="k">{b.open ? (hi ? 'शाखा का सामान्य समय' : 'Typical branch hours') : hi ? 'बैंक फिर खुलेंगे' : 'Banks reopen'}</div><div className="v t">{b.open ? BANK_HOURS : fmtMed(nb, lang)}{b.open && <small>{hi ? 'शाखा के अनुसार अलग हो सकता है' : 'Varies by branch'}</small>}</div></div>
            <div><div className="k">{hi ? 'अगला कार्य दिवस' : 'Next working day'}</div><div className="v t">{fmtMed(nb, lang)}</div></div>
          </div>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{hi ? 'आज' : 'Today'}</div><Pill v={b.open ? 'yes' : 'no'} size="xs">{b.open ? T.o(lang) : T.c(lang)}</Pill><div className="v t">{fmtDM(today, lang)}</div><div className="s">{bankShort(b.reason, lang)}</div></div>
          <div className="card mini"><div className="k">{hi ? 'कल' : 'Tomorrow'}</div><Pill v={tm.open ? 'yes' : 'no'} size="xs">{tm.open ? T.o(lang) : T.c(lang)}</Pill><div className="v t">{fmtDM(addDays(today, 1), lang)}</div><div className="s">{bankShort(tm.reason, lang)}</div></div>
        </div>
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}>
          <a href={RBI.source} rel="noopener">{hi ? 'अवकाश तालिका' : 'Holiday Matrix'}</a>, {RBI.offices[city.office].name} {hi ? 'कार्यालय' : 'office'}{city.derived ? (hi ? ` (${where} की सूची)` : ` (${st.name} list)`) : ''}
        </Source>
        <Share text={shareText} path={`${pre}/${city.slug}/bank`} lang={lang} ics={{ href: `/ics/bank-${city.state}-2026.ics`, label: hi ? 'कैलेंडर में जोड़ें' : 'Add to calendar' }} />

        <div className={`card module ${satS.open ? 'openm' : 'closed'}`}>
          <div className="k t">{sat === today ? (hi ? 'आज, शनिवार' : 'Today, Saturday') : hi ? 'इस शनिवार' : 'This Saturday'}, {fmtDM(sat, lang)}</div>
          <h3>{satS.open ? (hi ? 'बैंक खुले' : 'Banks open') : hi ? 'बैंक बंद' : 'Banks closed'} <Pill v={satS.open ? 'yes' : 'no'} size="xs">{bankShort(satS.reason, lang)}</Pill></h3>
          <p>
            {hi ? 'सभी अनुसूचित और गैर-अनुसूचित बैंक हर महीने के दूसरे और चौथे शनिवार को बंद रहते हैं।' : 'All scheduled and non-scheduled banks close on the second and fourth Saturday of every month.'}
            {sameMonthSats.length > 0 && (hi ? ` इस महीने ${sameMonthSats.map((d) => fmtDM(d, 'hi')).join(', ')} भी।` : ` This month, also ${sameMonthSats.map((d) => fmtDM(d)).join(', ')}.`)}
          </p>
        </div>

        <div className="sech"><h2>{hi ? `${cname} में आगे की छुट्टियाँ` : `Upcoming bank closures in ${city.name}`}</h2><span>{hi ? 'अगले 40 दिन, रविवार छोड़कर' : 'Next 40 days, excl. Sundays'}</span></div>
        <div className="card list">
          {up.length === 0 ? <div className="row"><div className="nm">{hi ? 'कोई छुट्टी नहीं' : 'No closures in this period'}</div></div> : up.map((u) => (
            <div className="row" key={u.date}>
              <DTile iso={u.date} lang={lang} />
              <div className="nm">{bankShort(u.reason, lang)}<small className="t">{fmtLong(u.date, lang)}</small></div>
              <Pill v="no" size="xs">{T.c(lang)}</Pill>
            </div>
          ))}
        </div>
        <p className="footsrc">
          <a href={`/bank-holidays-2026/${city.state}`}>{hi ? `${where} की 2026 की पूरी सूची →` : `Full 2026 bank holiday list for ${st.name} →`}</a>{' · '}
          <a href={`${pre}/${city.slug}/post-office`}>{hi ? 'डाकघर आज' : 'Post office today'}</a>{' · '}
          <a href={hi ? '/hi/share-market' : '/share-market'}>{hi ? 'शेयर बाज़ार आज' : 'Share market today'}</a>
        </p>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={faq} />
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>{hi ? 'दूसरा शहर देखें' : 'Check another city'}</h2></div>
          <CitySwitcher current={city.slug} lang={lang} base="bank" />
        </div>
        <div className="card panel">
          <div className="top"><h2>{hi ? `${monthName(monthNum(today), 'hi')} में` : `In ${monthName(monthNum(today))}`}</h2></div>
          {hols.filter((h) => h.d.slice(0, 7) === today.slice(0, 7)).map((h) => (
            <div className="prow" key={h.d}><span className="t">{fmtMed(h.d, lang)}<small>{shortName(h.n, lang)}</small></span><Pill v={h.d < today ? 'neu' : 'no'} size="xs">{h.d < today ? (hi ? 'बीत गया' : 'Past') : T.c(lang)}</Pill></div>
          ))}
          <a className="lnk" href={`/bank-holidays/${['january','february','march','april','may','june','july','august','september','october','november','december'][monthNum(today) - 1]}-2026`} style={{ display: 'inline-block', marginTop: 10 }}>{hi ? 'सभी राज्यों की इस महीने की छुट्टियाँ →' : 'This month across India →'}</a>
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}
