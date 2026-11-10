import { City, stateBySlug } from '@/lib/places';
import { cityHolidays, nextPostHoliday, nextPostOpen, postDay, PostStatus, LAST_CHECKED, bankDay, upcomingPostHolidays, circleOf, circleShort, INDIAPOST } from '@/lib/data';
import { addDays, fmtDM, fmtLong, fmtMed } from '@/lib/date';
import { shortName } from '@/lib/names';
import { T } from '@/lib/text';
import { POST_HOURS } from '@/lib/site';
import { SvcIcon } from './icons';
import { CitySwitcher, Crumb, DTile, Faq, Pill, Share, Source } from './ui';

const pillOf = (p: PostStatus): 'yes' | 'no' | 'neu' => (p.state === 'closed' ? 'no' : p.state === 'check' ? 'neu' : 'yes');
export function postLabel(p: PostStatus, l: 'en' | 'hi', long = false) {
  const hi = l === 'hi';
  if (p.state === 'closed') return long ? T.closed(l) : T.c(l);
  if (p.state === 'check') return p.kind === 'saturday' ? (hi ? 'अवकाश नहीं' : 'Not a holiday') : hi ? 'स्थानीय रूप से जाँचें' : 'Check locally';
  return long ? (hi ? 'काउंटर आज खुले हैं' : 'Counters open today') : T.o(l);
}
export function postReason(p: PostStatus, l: 'en' | 'hi', circle: string) {
  const hi = l === 'hi';
  switch (p.kind) {
    case 'holiday': return hi ? `भारत डाक के ${circle} की सूची में अवकाश: ${p.hi}${p.allIndia ? ' (अखिल भारतीय अवकाश)' : ''}।` : `India Post holiday for the ${circle}: ${p.name}${p.allIndia ? ' (an All-India postal holiday)' : ''}.${p.moon ? ' The date can shift with moon sighting.' : ''}`;
    case 'sunday': return hi ? 'रविवार — डाकघर बंद रहते हैं।' : 'Sunday — post offices are closed.';
    case 'saturday': return hi ? 'शनिवार भारत डाक की अवकाश सूची में नहीं है। बैंकों का दूसरे/चौथे शनिवार का नियम डाकघरों के लिए आधिकारिक रूप से तय नहीं है, और शनिवार का समय कार्यालय के अनुसार अलग होता है — अपने डाकघर से पुष्टि करें।' : 'Saturday is not on India Post’s holiday list. The banks’ 2nd/4th Saturday rule is not an India Post rule, and Saturday hours vary by office — confirm with your post office.';
    case 'localFestival': return hi ? `बैंक आज ${shortName(p.bankHoliday!, 'hi')} के लिए बंद हैं, लेकिन यह ${circle} की डाक अवकाश सूची में नहीं है, इसलिए डाकघर खुले रहने चाहिए।` : `Banks are closed today for ${shortName(p.bankHoliday!)}, but it is not on the ${circle} postal holiday list, so post offices should be open.`;
    case 'nodata': return hi ? 'भारत डाक ने इस वर्ष की सर्कल सूची अभी जारी नहीं की है; केवल केंद्र सरकार के अनिवार्य अवकाश ज्ञात हैं।' : 'India Post has not published this year’s circle list yet; only the compulsory central government holidays are known.';
    default: return hi ? `नियमित कार्य दिवस। आज ${circle} की डाक अवकाश सूची में कोई छुट्टी नहीं है।` : `Regular working day. Nothing is listed for the ${circle} on India Post’s holiday list today.`;
  }
}

export function postFaq(city: City, l: 'en' | 'hi') {
  if (l === 'hi')
    return [
      { q: 'क्या आज स्पीड पोस्ट की डिलीवरी होगी?', a: 'यह स्टेटस डाकघर काउंटरों के लिए है, डिलीवरी की गारंटी नहीं। छुट्टियों पर डिलीवरी आमतौर पर रुकती है।' },
      { q: 'क्या शनिवार को डाकघर खुले रहते हैं?', a: 'भारत डाक की अवकाश सूची में शनिवार (दूसरा/चौथा भी) अवकाश के रूप में नहीं है। शनिवार का समय कार्यालय के अनुसार अलग होता है, इसलिए अपने डाकघर से पुष्टि करें।' },
      { q: 'डाकघर की छुट्टियाँ कौन तय करता है?', a: 'भारत डाक हर साल एक अखिल भारतीय सूची (14 अवकाश) और हर डाक सर्कल की अलग सूची प्रकाशित करता है, जो केंद्र सरकार (DoPT) की अवकाश सूची पर आधारित है।' },
    ];
  return [
    { q: 'Is Speed Post delivered today?', a: `This status is for post office counters in ${city.name}, not a delivery guarantee. Delivery usually pauses on holidays when counters are closed.` },
    { q: 'Are post offices open on Saturday?', a: 'Saturdays — including the 2nd and 4th — are not on India Post’s holiday list. Saturday hours vary by office, so confirm timings with your post office.' },
    { q: 'Who decides post office holidays?', a: 'India Post publishes an All-India list (14 holidays in 2026) and a separate list for each postal circle (usually 17 days), based on the central government (DoPT) holiday orders.' },
    { q: 'Are post offices closed on bank holidays?', a: 'Not necessarily. Many RBI bank holidays are state festivals that are not central government holidays, so post offices often stay open when banks are closed.' },
  ];
}

export function PostView({ city, today, lang = 'en' }: { city: City; today: string; lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const p = postDay(city.state, today, hols);
  const t = postDay(city.state, addDays(today, 1), hols);
  const nx = nextPostHoliday(city.state, today);
  const circ = circleOf(city.state);
  const circle = circleShort(circ.name) + (circ.name === 'All India' ? '' : hi ? '' : '');
  const no = nextPostOpen(city.state, today);
  const where = hi ? st.hi : st.name;
  const cname = hi ? city.hi : city.name;
  const pre = hi ? '/hi' : '';
  const year = today.slice(0, 4) === '2027' ? '2027' : '2026';
  const unlike: { d: string; b: ReturnType<typeof bankDay>; p: PostStatus }[] = [];
  for (let i = 0; i <= 30; i++) {
    const d = addDays(today, i);
    const b = bankDay(hols, d);
    const pp = postDay(city.state, d, hols);
    if (!b.open && b.reason.kind !== 'sunday' && pp.state !== 'closed') unlike.push({ d, b, p: pp });
  }
  const shareText = hi ? `${cname} में आज डाकघर ${p.state === 'closed' ? 'बंद हैं' : 'खुले हैं'} (${fmtMed(today, 'hi')})` : `Post offices in ${city.name}: ${postLabel(p, 'en')} today (${fmtMed(today)})`;
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { href: hi ? undefined : `/${city.slug}`, label: cname }, { label: hi ? 'डाकघर' : 'Post office' }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="post" size="lg" />
          <h1 className="qh">{hi ? `क्या आज ${cname} में डाकघर खुला है?` : `Is the post office open today in ${city.name}?`}</h1>
          <p className="big" id="ans">{hi ? `${cname} में डाकघर` : `Post office in ${city.name}`}</p>
          <div className="statusrow"><Pill v={pillOf(p)} size="lg">{postLabel(p, lang, true)}</Pill><span className="dt t">{fmtLong(today, lang)}</span></div>
          <p className="answer"><b>{p.state === 'closed' ? (hi ? `नहीं, ${cname} में डाकघर आज, ${fmtLong(today, 'hi')}, बंद हैं।` : `No, post offices in ${city.name} are closed today, ${fmtLong(today)}.`) : p.state === 'open' ? (hi ? `हाँ, ${cname} में डाकघर आज, ${fmtLong(today, 'hi')}, खुले हैं।` : `Yes, post offices in ${city.name} are open today, ${fmtLong(today)}.`) : (hi ? `${cname} में आज, ${fmtLong(today, 'hi')}, डाक अवकाश नहीं है।` : `Today, ${fmtLong(today)}, is not a postal holiday in ${city.name}.`)}</b> {postReason(p, lang, circle)} (<a href={INDIAPOST.source} rel="noopener">{hi ? 'भारत डाक अवकाश सूची' : 'India Post holidays list'}</a>){circ.note ? (hi ? '' : ` ${circ.note}.`) : ''} {hi ? 'डाक घर बैंक छुट्टी सूची से अलग सूची मानते हैं।' : 'Post offices follow a different list from banks.'}</p>
          <div className="hrs">
            <div><div className="k">{hi ? 'सामान्य समय' : 'Typical hours'}</div><div className="v t">{POST_HOURS}<small>{hi ? 'कार्यालय के अनुसार अलग · आधिकारिक नहीं' : 'Varies by office · not official'}</small></div></div>
            <div><div className="k">{p.state === 'closed' ? (hi ? 'फिर खुलेंगे' : 'Reopens') : hi ? 'अगला अवकाश' : 'Next holiday'}</div><div className="v t">{p.state === 'closed' ? fmtMed(no, lang) : nx ? fmtMed(nx.d, lang) : '—'}{p.state !== 'closed' && nx && <small>{hi ? nx.hi : nx.n}</small>}</div></div>
          </div>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{hi ? 'आज' : 'Today'}</div><Pill v={pillOf(p)} size="xs">{postLabel(p, lang)}</Pill><div className="v t">{fmtDM(today, lang)}</div></div>
          <div className="card mini"><div className="k">{hi ? 'कल' : 'Tomorrow'}</div><Pill v={pillOf(t)} size="xs">{postLabel(t, lang)}</Pill><div className="v t">{fmtDM(addDays(today, 1), lang)}</div></div>
        </div>
        <Source tag="India Post" checked={LAST_CHECKED} lang={lang}>
          <a href={INDIAPOST.source} rel="noopener">{hi ? `अवकाश सूची ${year}` : `Holidays list ${year}`}</a>, {circ.name}
        </Source>
        <Share text={shareText} path={`${pre}/${city.slug}/post-office`} lang={lang} ics={{ href: `/ics/post-office-${year}.ics`, label: hi ? 'कैलेंडर में जोड़ें' : 'Add to calendar' }} />
        {unlike.length > 0 && (
          <>
            <div className="sech"><h2>{hi ? 'बैंकों से अलग' : 'Unlike banks'}</h2><span>{hi ? 'अगले 30 दिन' : 'Next 30 days'}</span></div>
            <div className="card list">
              {unlike.map((u) => (
                <div className="row" key={u.d}>
                  <DTile iso={u.d} lang={lang} />
                  <div className="nm">{u.b.reason.kind === 'holiday' ? shortName(u.b.reason.rbi!, lang) : u.b.reason.kind === 'saturday2' ? (hi ? 'दूसरा शनिवार' : '2nd Saturday') : hi ? 'चौथा शनिवार' : '4th Saturday'}<small>{hi ? 'बैंक बंद' : 'Banks closed'} · {hi ? 'डाकघर' : 'post office'}: {postLabel(u.p, lang)}</small></div>
                  <Pill v={pillOf(u.p)} size="xs">{postLabel(u.p, lang)}</Pill>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="footsrc">
          {hi ? `यह जानकारी भारत डाक की ${circ.name} सूची से है। “अवकाश नहीं” का अर्थ है कि दिन सूची में नहीं है; समय के लिए अपने डाकघर से पुष्टि करें।` : `Status uses India Post’s ${circ.name} list${circ.note ? ` (${circ.note})` : ''}. “Not a holiday” means the day is not on the list; confirm Saturday hours with your office.`}{' '}
          <a href="/post-office-holidays-2026">{hi ? '2026 की पूरी सूची →' : 'Full 2026 list →'}</a>
        </p>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={postFaq(city, lang)} />
      </div>
      <aside className="side">
        <div className="card panel"><div className="top"><h2>{hi ? 'दूसरा शहर देखें' : 'Check another city'}</h2></div><CitySwitcher current={city.slug} lang={lang} base="post-office" /></div>
        <div className="card panel">
          <div className="top"><h2>{hi ? 'आगे के अवकाश' : 'Coming up'}</h2></div>
          {upcomingPostHolidays(city.state, addDays(today, -1)).slice(0, 5).map((h) => (
            <div className="prow" key={h.d + h.n}><span className="t">{fmtMed(h.d, lang)}<small>{hi ? h.hi : h.n}</small></span><Pill v="no" size="xs">{T.c(lang)}</Pill></div>
          ))}
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}
