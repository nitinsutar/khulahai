import { NSE, marketDay, nextMarketHoliday, lastMarketHoliday, nextMarketOpen, LAST_CHECKED } from '@/lib/data';
import { addDays, fmtDM, fmtLong, fmtMed, monthName, monthNum } from '@/lib/date';
import { T } from '@/lib/text';
import { SvcIcon } from './icons';
import { Crumb, DTile, Faq, Pill, Share, Source } from './ui';

const HI: Record<string, string> = {
  'Municipal Corporation Election - Maharashtra': 'महाराष्ट्र नगर निगम चुनाव', 'Republic Day': 'गणतंत्र दिवस', Mahashivratri: 'महाशिवरात्रि', Holi: 'होली', 'Id-Ul-Fitr (Ramadan Eid)': 'ईद-उल-फ़ित्र', 'Shri Ram Navami': 'राम नवमी', 'Shri Mahavir Jayanti': 'महावीर जयंती', 'Good Friday': 'गुड फ्राइडे', 'Dr. Baba Saheb Ambedkar Jayanti': 'आंबेडकर जयंती', 'Maharashtra Day': 'महाराष्ट्र दिवस', 'Bakri Id': 'बकरीद', Muharram: 'मुहर्रम', 'Independence Day': 'स्वतंत्रता दिवस', 'Ganesh Chaturthi': 'गणेश चतुर्थी', 'Mahatma Gandhi Jayanti': 'गांधी जयंती', Dussehra: 'दशहरा', 'Diwali Laxmi Pujan': 'दिवाली लक्ष्मी पूजन', 'Diwali-Balipratipada': 'दिवाली बलिप्रतिपदा', 'Prakash Gurpurb Sri Guru Nanak Dev': 'गुरु नानक जयंती', Christmas: 'क्रिसमस',
};
const nm = (n: string, l: 'en' | 'hi') => (l === 'hi' ? HI[n] ?? n : n);

export function marketNow(today: string, mins: number, l: 'en' | 'hi') {
  const hi = l === 'hi';
  const m = marketDay(today);
  if (!m.open) return hi ? 'आज कोई ट्रेडिंग सत्र नहीं' : 'No trading session today';
  if (mins < 9 * 60) return hi ? 'प्री-ओपन 9:00 बजे शुरू होगा' : 'Pre-open starts at 9:00';
  if (mins < 9 * 60 + 8) return hi ? 'प्री-ओपन सत्र चल रहा है' : 'Pre-open session is on';
  if (mins < 9 * 60 + 15) return hi ? 'सामान्य ट्रेडिंग 9:15 बजे शुरू होगी' : 'Normal trading starts at 9:15';
  if (mins < 15 * 60 + 30) return hi ? 'अभी ट्रेडिंग चल रही है' : 'Trading is live now';
  return hi ? 'आज का सत्र 15:30 बजे बंद हो गया' : 'Today’s session closed at 15:30';
}
export const marketFaq = (l: 'en' | 'hi') =>
  l === 'hi'
    ? [
        { q: 'शेयर बाज़ार का समय क्या है?', a: 'NSE और BSE पर इक्विटी का सामान्य सत्र सोमवार से शुक्रवार सुबह 9:15 से दोपहर 3:30 बजे (IST) तक चलता है। प्री-ओपन सत्र 9:00 से 9:08 तक होता है।' },
        { q: 'क्या शनिवार और रविवार को बाज़ार खुला रहता है?', a: 'नहीं। शनिवार और रविवार को कोई नियमित ट्रेडिंग नहीं होती, जब तक एक्सचेंज कोई विशेष सत्र घोषित न करे (जैसे दिवाली का मुहूर्त ट्रेडिंग)।' },
        { q: 'क्या NSE और BSE की छुट्टियाँ एक जैसी हैं?', a: '2026 में इक्विटी सेगमेंट के लिए दोनों एक्सचेंजों की छुट्टियों की सूची एक जैसी है।' },
      ]
    : [
        { q: 'What are share market timings in India?', a: 'The NSE and BSE equity normal session runs Monday to Friday, 9:15 am to 3:30 pm IST. The pre-open session runs 9:00 to 9:08 am.' },
        { q: 'Is the share market open on Saturday and Sunday?', a: 'No. There is no regular trading on Saturdays and Sundays unless the exchanges announce a special session, such as Diwali Muhurat trading.' },
        { q: 'Are NSE and BSE holidays the same?', a: 'Yes for 2026. The equity and equity derivatives holiday lists of NSE and BSE match, including the 15 January closure added for Maharashtra municipal elections.' },
        { q: 'When will the 2027 NSE holiday list come out?', a: 'The exchanges usually publish next year’s list in December. We will add it here as soon as the official circular is out.' },
      ];

export function MarketView({ today, mins, lang = 'en', mode }: { today: string; mins: number; lang?: 'en' | 'hi'; mode: 'status' | 'list' }) {
  const hi = lang === 'hi';
  const m = marketDay(today);
  const t = marketDay(addDays(today, 1));
  const nh = nextMarketHoliday(today);
  const lh = lastMarketHoliday(today);
  const no = nextMarketOpen(today);
  const hh = String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  const months = [...new Set(NSE.holidays.map((h) => monthNum(h.d)))];
  const weekday = NSE.holidays.filter((h) => !h.weekend);
  const path = hi ? '/hi/share-market' : mode === 'status' ? '/share-market' : '/nse-bse-holidays-2026';
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { label: hi ? 'शेयर बाज़ार' : mode === 'list' ? 'NSE & BSE holidays 2026' : 'Share market' }]} />
        <section className="card mstat" aria-labelledby="ans">
          <div className="top">
            <SvcIcon s="mkt" size="lg" />
            <div><div className="e">{hi ? 'NSE और BSE इक्विटी' : 'NSE & BSE equity'}</div>
              {mode === 'list' && !hi ? <><h1 id="ans" className="name">NSE &amp; BSE holidays 2026</h1></> : <h1 id="ans" className="name">{hi ? 'क्या आज शेयर बाज़ार खुला है?' : 'Share market today'}</h1>}
            </div>
          </div>
          <div className="statusrow">
            <Pill v={m.open ? 'yes' : 'no'} size="lg">{m.open ? T.open(lang) : T.closed(lang)}</Pill>
            <div className="sess"><div className="k">{hi ? 'सत्र' : 'Session'}</div><div className="v t">{NSE.session.open}–{NSE.session.close} IST</div></div>
          </div>
          <p className="sub">
            <span className="t">{fmtLong(today, lang)}</span> · {m.open ? marketNow(today, mins, lang) : m.kind === 'holiday' ? (hi ? `ट्रेडिंग अवकाश: ${nm(m.name!, 'hi')}` : `Trading holiday: ${m.name}`) : hi ? 'सप्ताहांत — कोई ट्रेडिंग नहीं' : 'Weekend — no trading'}
            {m.open && <span className="t"> ({hi ? 'समय' : 'as of'} {hh} IST)</span>}
            {!m.open && <> · {hi ? 'अगला सत्र' : 'Next session'}: <b className="t">{fmtMed(no, lang)}</b></>}
          </p>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{hi ? 'कल' : 'Tomorrow'}</div><Pill v={t.open ? 'yes' : 'no'} size="xs">{t.open ? T.o(lang) : T.c(lang)}</Pill><div className="v t">{fmtMed(addDays(today, 1), lang)}</div><div className="s">{t.kind === 'holiday' ? nm(t.name!, lang) : t.kind === 'weekend' ? (hi ? 'सप्ताहांत' : 'Weekend') : hi ? 'ट्रेडिंग दिवस' : 'Trading day'}</div></div>
          <div className="card mini"><div className="k">{hi ? 'अगली छुट्टी' : 'Next holiday'}</div><div className="v t">{nh ? fmtMed(nh.d, lang) : '—'}</div><div className="s">{nh ? nm(nh.n, lang) : hi ? '2027 सूची जल्द' : '2027 list coming'}</div>{lh && <div className="s">{hi ? 'पिछली' : 'Last'}: <span className="t">{fmtMed(lh.d, lang)}</span> · {nm(lh.n, lang)}</div>}</div>
        </div>
        <Source tag="NSE · BSE" checked={LAST_CHECKED} lang={lang}>
          <a href={NSE.source} rel="noopener">NSE</a> &amp; <a href={NSE.bseSource} rel="noopener">BSE</a> {hi ? '2026 ट्रेडिंग अवकाश परिपत्र' : '2026 trading holiday circulars'}
        </Source>
        <Share text={hi ? `आज शेयर बाज़ार ${m.open ? 'खुला है' : 'बंद है'}` : `Share market is ${m.open ? 'open' : 'closed'} today (${fmtMed(today)})`} path={path} lang={lang} ics={{ href: '/ics/nse-bse-2026.ics', label: hi ? 'कैलेंडर में जोड़ें' : 'Add to calendar' }} />
        <div className="sech"><h2>{hi ? 'NSE और BSE छुट्टियाँ 2026' : 'NSE & BSE trading holidays 2026'}</h2><span><span className="t">{weekday.length}</span> {hi ? 'कार्यदिवस बंद' : 'weekday closures'}</span></div>
        <div className="card list">
          {months.map((mo) => (
            <div key={mo}>
              <div className="monthh"><span>{monthName(mo, lang)}</span></div>
              {NSE.holidays.filter((h) => monthNum(h.d) === mo).map((h) => (
                <div className={`row${h.d < today ? ' past' : ''}`} key={h.d}>
                  <DTile iso={h.d} lang={lang} />
                  <div className="nm">{nm(h.n, lang)}<small className="t">{fmtLong(h.d, lang)}{h.weekend ? (hi ? ' · सप्ताहांत पर' : ' · falls on a weekend') : ''}</small></div>
                  <Pill v={h.weekend ? 'neu' : 'no'} size="xs">{h.weekend ? (hi ? 'सप्ताहांत' : 'Weekend') : T.c(lang)}</Pill>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="card module">
          <div className="k">{hi ? 'मुहूर्त ट्रेडिंग' : 'Muhurat trading'}</div>
          <p>{hi ? 'दिवाली लक्ष्मी पूजन (रविवार, 8 नवंबर 2026) पर मुहूर्त ट्रेडिंग हुई। एक्सचेंज इसका समय अलग परिपत्र में बताते हैं।' : 'Muhurat trading was held on Diwali Laxmi Pujan, Sunday 8 November 2026. The exchanges announce its timing in a separate circular.'}</p>
        </div>
        <p className="footsrc">{hi ? 'सूची इक्विटी और इक्विटी डेरिवेटिव सेगमेंट के लिए है। एक्सचेंज बाद के परिपत्र से तारीख बदल सकते हैं।' : 'This list is for the equity and equity derivatives segments. Currency and commodity segments follow different calendars. The exchanges may change a date by a later circular.'} <a href="/nse-bse-holidays-2027">{hi ? '2027 सूची' : '2027 list'} →</a></p>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={marketFaq(lang)} />
      </div>
      <aside className="side">
        <div className="card panel">
          <div className="top"><h2>{hi ? 'इस हफ़्ते' : 'This week'}</h2></div>
          {Array.from({ length: 7 }, (_, i) => addDays(today, i)).map((d) => {
            const s = marketDay(d);
            return <div className="prow" key={d}><span className="t">{fmtMed(d, lang)}{s.kind === 'holiday' && <small>{nm(s.name!, lang)}</small>}</span><Pill v={s.open ? 'yes' : 'no'} size="xs">{s.open ? T.o(lang) : T.c(lang)}</Pill></div>;
          })}
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}
