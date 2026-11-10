import { City, stateBySlug } from '@/lib/places';
import { cityHolidays, nextPostHoliday, nextPostOpen, postDay, PostStatus, CENTRAL, LAST_CHECKED, bankDay } from '@/lib/data';
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
  if (p.state === 'check') return hi ? 'स्थानीय रूप से जाँचें' : 'Check locally';
  return long ? (hi ? 'काउंटर आज खुले हैं' : 'Counters open today') : T.o(l);
}
export function postReason(p: PostStatus, l: 'en' | 'hi', where: string) {
  const hi = l === 'hi';
  switch (p.kind) {
    case 'holiday': return hi ? `केंद्र सरकार का राजपत्रित अवकाश: ${p.hi}।${p.moon ? ' (चाँद दिखने पर तारीख बदल सकती है)' : ''}` : `Central government gazetted holiday: ${p.name}.${p.moon ? ' (Date can shift with moon sighting.)' : ''}`;
    case 'sunday': return hi ? 'रविवार — डाकघर बंद रहते हैं।' : 'Sunday — post offices are closed.';
    case 'saturday': return hi ? 'शनिवार को डाकघर आमतौर पर खुले रहते हैं; बैंकों का दूसरे/चौथे शनिवार का नियम डाकघरों पर लागू नहीं होता। समय कार्यालय के अनुसार अलग होता है।' : 'Post offices usually work on Saturdays — the banks’ 2nd/4th Saturday rule does not apply to them. Hours vary by office.';
    case 'localFestival':
      if (p.state === 'check') return hi ? `${p.hi} केंद्र सरकार की वैकल्पिक सूची में है। ${where} में डाक सर्कल ने इसे चुना हो तो डाकघर बंद होंगे — अपने डाकघर से पुष्टि करें।` : `${p.name} is on the central government’s optional list. Post offices close only if the ${where} coordination committee picked it — confirm with your local office.`;
      return hi ? `बैंक आज ${shortName(p.bankHoliday!, 'hi')} के लिए बंद हैं, लेकिन यह केंद्र सरकार का अनिवार्य अवकाश नहीं है, इसलिए डाकघर सामान्यतः खुले रहते हैं।` : `Banks are closed today for ${shortName(p.bankHoliday!)}, but it is not a compulsory central government holiday, so post offices normally stay open.`;
    default: return hi ? `नियमित कार्य दिवस। आज ${where} में केंद्र सरकार का कोई अनिवार्य अवकाश नहीं है।` : `Regular working day. No compulsory central government holiday in ${where} today.`;
  }
}

export function postFaq(city: City, l: 'en' | 'hi') {
  if (l === 'hi')
    return [
      { q: 'क्या आज स्पीड पोस्ट की डिलीवरी होगी?', a: 'यह स्टेटस डाकघर काउंटरों के लिए है, डिलीवरी की गारंटी नहीं। छुट्टियों पर डिलीवरी आमतौर पर रुकती है।' },
      { q: 'क्या शनिवार को डाकघर खुले रहते हैं?', a: 'हाँ, आमतौर पर। बैंकों का दूसरे और चौथे शनिवार का नियम डाकघरों पर लागू नहीं होता। समय कार्यालय के अनुसार अलग हो सकता है।' },
      { q: 'डाकघर की छुट्टियाँ कौन तय करता है?', a: 'डाकघर केंद्र सरकार के कार्यालय हैं। DoPT हर साल 14 अनिवार्य अवकाश तय करता है; हर राज्य की समन्वय समिति 3 और अवकाश चुनती है।' },
    ];
  return [
    { q: 'Is Speed Post delivered today?', a: `This status is for post office counters in ${city.name}, not a delivery guarantee. Delivery usually pauses on holidays when counters are closed.` },
    { q: 'Are post offices open on Saturday?', a: 'Usually yes. The banks’ 2nd and 4th Saturday rule does not apply to post offices. Saturday hours vary by office, so check with your branch for exact timings.' },
    { q: 'Who decides post office holidays?', a: 'Post offices are central government offices. DoPT fixes 14 compulsory holidays every year; each state’s coordination committee then picks 3 more from a list of 12 optional festivals. In Delhi, DoPT picks those 3 itself.' },
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
          <p className="q">{hi ? 'क्या आज डाकघर खुला है?' : 'Is the post office open today?'}</p>
          <h1 id="ans">{hi ? `${cname} में डाकघर` : `Post office in ${city.name}`}</h1>
          <div className="statusrow"><Pill v={pillOf(p)} size="lg">{postLabel(p, lang, true)}</Pill><span className="dt t">{fmtLong(today, lang)}</span></div>
          <p className="reason">{postReason(p, lang, where)}</p>
          <div className="hrs">
            <div><div className="k">{hi ? 'सामान्य समय' : 'Typical hours'}</div><div className="v t">{POST_HOURS}<small>{hi ? 'कार्यालय के अनुसार अलग · आधिकारिक नहीं' : 'Varies by office · not official'}</small></div></div>
            <div><div className="k">{p.state === 'closed' ? (hi ? 'फिर खुलेंगे' : 'Reopens') : hi ? 'अगला अवकाश' : 'Next holiday'}</div><div className="v t">{p.state === 'closed' ? fmtMed(no, lang) : nx ? fmtMed(nx.d, lang) : '—'}{p.state !== 'closed' && nx && <small>{hi ? nx.hi : nx.n}</small>}</div></div>
          </div>
        </section>
        <div className="two">
          <div className="card mini"><div className="k">{hi ? 'आज' : 'Today'}</div><Pill v={pillOf(p)} size="xs">{postLabel(p, lang)}</Pill><div className="v t">{fmtDM(today, lang)}</div></div>
          <div className="card mini"><div className="k">{hi ? 'कल' : 'Tomorrow'}</div><Pill v={pillOf(t)} size="xs">{postLabel(t, lang)}</Pill><div className="v t">{fmtDM(addDays(today, 1), lang)}</div></div>
        </div>
        <Source tag="DoPT" checked={LAST_CHECKED} lang={lang}>
          <a href={CENTRAL.source} rel="noopener">{hi ? `केंद्र सरकार अवकाश सूची ${year}` : `Central government holidays ${year}`}</a>
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
                  <Pill v={u.p.kind === 'saturday' ? 'neu' : pillOf(u.p)} size="xs">{u.p.kind === 'saturday' ? (hi ? 'आमतौर पर खुला' : 'Usually open') : postLabel(u.p, lang)}</Pill>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="footsrc">
          {hi ? 'डाकघर केंद्र सरकार के 14 अनिवार्य अवकाश मानते हैं, साथ ही राज्य द्वारा चुने गए 3 अवकाश। हम केवल आधिकारिक DoPT सूची दिखाते हैं; राज्य के चुने हुए दिनों के लिए अपने डाकघर से पुष्टि करें।' : `Post offices observe the 14 compulsory central government holidays plus 3 chosen for ${st.name}. We show only the official DoPT list — confirm state-chosen days with your local office.`}{' '}
          <a href="/post-office-holidays-2026">{hi ? '2026 की पूरी सूची →' : 'Full 2026 list →'}</a>
        </p>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={postFaq(city, lang)} />
      </div>
      <aside className="side">
        <div className="card panel"><div className="top"><h2>{hi ? 'दूसरा शहर देखें' : 'Check another city'}</h2></div><CitySwitcher current={city.slug} lang={lang} base="post-office" /></div>
        <div className="card panel">
          <div className="top"><h2>{hi ? 'आगे के अवकाश' : 'Coming up'}</h2></div>
          {[...CENTRAL['2026'].holidays, ...CENTRAL['2027'].holidays].filter((h) => h.d >= today && (h.c || city.state === 'delhi')).slice(0, 5).map((h) => (
            <div className="prow" key={h.d + h.n}><span className="t">{fmtMed(h.d, lang)}<small>{hi ? h.hi : h.n}</small></span><Pill v="no" size="xs">{T.c(lang)}</Pill></div>
          ))}
        </div>
        <div className="adslot" aria-hidden="true" />
      </aside>
    </div>
  );
}
