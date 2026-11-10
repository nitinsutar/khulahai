import { RBI, NSE, MCX, INDIAPOST, LAST_CHECKED, officesClosedOn, circleShort } from '@/lib/data';
import { STATES } from '@/lib/places';
import { fmtLong } from '@/lib/date';
import { SvcIcon } from './icons';
import { Crumb, Pill, Source, Share, Faq } from './ui';

export const GNJ = '2026-11-24';
export function gnjData() {
  const closed = officesClosedOn(GNJ);
  const closedSlugs = new Set(closed.map((o) => o.slug));
  const open = Object.entries(RBI.offices).filter(([k]) => !closedSlugs.has(k)).map(([slug, o]) => ({ slug, name: o.name, state: STATES.find((s) => s.offices.includes(slug) && !s.mappedFrom) }));
  const circlesWithout = Object.keys(INDIAPOST.circles).filter((c) => !INDIAPOST.circles[c].some((h) => h.d === GNJ));
  const mcx = MCX.holidays.find((h) => h.d === GNJ)!;
  const nse = NSE.holidays.find((h) => h.d === GNJ);
  return { closed, open, circlesWithout, mcx, nse };
}
export function gnjAnswer(lang: 'en' | 'hi') {
  const { closed, open } = gnjData();
  const d = fmtLong(GNJ, lang);
  return lang === 'hi'
    ? `ज़्यादातर जगह नहीं। ${d} को गुरु नानक जयंती पर आरबीआई के 34 में से ${closed.length} केंद्रों पर बैंक बंद हैं, जिनमें मुंबई, दिल्ली, कोलकाता, हैदराबाद, लखनऊ, जयपुर और चंडीगढ़ शामिल हैं। बेंगलुरु, चेन्नई, अहमदाबाद, पटना समेत ${open.length} केंद्रों पर बैंक खुले हैं। NSE/BSE बंद हैं, डाकघर भारत डाक की अखिल भारतीय सूची के अनुसार बंद हैं। UPI और ATM चलते रहेंगे।`
    : `Mostly no. On ${d}, banks are closed for Guru Nanak Jayanti at ${closed.length} of RBI’s 34 centres — including Mumbai, New Delhi, Kolkata, Hyderabad, Lucknow, Jaipur and Chandigarh — and open at ${open.length}, including Bengaluru, Chennai, Ahmedabad and Patna. NSE and BSE are closed; post offices are closed (India Post All-India list). UPI and ATMs keep working.`;
}
export function gnjFaq(lang: 'en' | 'hi') {
  const { open, mcx } = gnjData();
  return lang === 'hi'
    ? [
        { q: 'क्या 24 नवंबर 2026 को शेयर बाज़ार बंद है?', a: 'हाँ। NSE और BSE की 2026 अवकाश सूची में 24 नवंबर (प्रकाश गुरपुरब श्री गुरु नानक देव) इक्विटी के लिए ट्रेडिंग अवकाश है।' },
        { q: 'क्या MCX खुला है?', a: `MCX के परिपत्र के अनुसार सुबह का सत्र ${mcx.m === 'Closed' ? 'बंद' : 'खुला'} और शाम का सत्र ${mcx.e === 'Open' ? 'खुला' : 'बंद'} है।` },
        { q: 'कहाँ बैंक खुले रहेंगे?', a: `आरबीआई के इन केंद्रों पर अवकाश नहीं है: ${open.map((o) => o.name).join(', ')}।` },
        { q: 'पंजाब और हरियाणा में क्या स्थिति है?', a: 'आरबीआई का पंजाब या हरियाणा के लिए अलग कार्यालय नहीं है। हम आरबीआई चंडीगढ़ की सूची दिखाते हैं, जिसमें 24 नवंबर अवकाश है — यह एक मैपिंग है।' },
      ]
    : [
        { q: 'Is the share market closed on 24 November 2026?', a: 'Yes. NSE and BSE list 24 November 2026 (Prakash Gurpurb Sri Guru Nanak Dev) as an equity trading holiday.' },
        { q: 'Is MCX open on Guru Nanak Jayanti 2026?', a: `Per MCX circular ${MCX.circular}, the morning session is ${mcx.m.toLowerCase()} and the evening session is ${mcx.e.toLowerCase()} on 24 November 2026.` },
        { q: 'Where are banks open on 24 November 2026?', a: `RBI lists no holiday that day for: ${open.map((o) => o.name).join(', ')}.` },
        { q: 'Are banks closed in Punjab and Haryana?', a: 'RBI has no separate office for Punjab or Haryana. We use the RBI Chandigarh list, which has 24 November as a holiday — treat this as a mapping and confirm with your branch.' },
        { q: 'Do co-operative banks follow this list?', a: 'Scheduled banks follow the RBI list. Some co-operative banks and regional rural banks may follow a different state list, so check with your branch.' },
      ];
}

export function GnjView({ lang = 'en' }: { lang?: 'en' | 'hi' }) {
  const hi = lang === 'hi';
  const { closed, open, circlesWithout, mcx } = gnjData();
  const path = hi ? '/hi/guru-nanak-jayanti-2026-bank-khula-hai' : '/is-bank-open-on-guru-nanak-jayanti-2026';
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { href: '/bank-holidays/november-2026', label: hi ? 'नवंबर 2026' : 'November 2026' }, { label: hi ? 'गुरु नानक जयंती' : 'Guru Nanak Jayanti' }]} />
        <section className="card hero" aria-labelledby="ans">
          <SvcIcon s="bank" size="lg" />
          <h1 className="qh">{hi ? 'गुरु नानक जयंती 2026 पर बैंक खुला है या नहीं?' : 'Is the bank open on Guru Nanak Jayanti 2026?'}</h1>
          <p className="big" id="ans">{hi ? `बैंक ${closed.length} केंद्रों में बंद` : `Banks closed in ${closed.length} of 34 centres`}</p>
          <div className="statusrow"><Pill v="no" size="lg">{hi ? 'ज़्यादातर बंद' : 'Mostly closed'}</Pill><span className="dt t">{fmtLong(GNJ, lang)}</span></div>
          <p className="answer"><b>{gnjAnswer(lang).split(hi ? '। ' : '. ')[0]}{hi ? '।' : '.'}</b> {gnjAnswer(lang).split(hi ? '। ' : '. ').slice(1).join(hi ? '। ' : '. ')} (<a href={RBI.source} rel="noopener">{hi ? 'आरबीआई अवकाश तालिका' : 'RBI holiday matrix'}</a>)</p>
        </section>
        <Source tag="RBI · NSE · MCX · India Post" checked={LAST_CHECKED} lang={lang}>
          <a href={RBI.source} rel="noopener">RBI</a>, <a href={NSE.source} rel="noopener">NSE</a>, <a href={NSE.bseSource} rel="noopener">BSE</a>, <a href={MCX.source} rel="noopener">MCX</a>, <a href={INDIAPOST.source} rel="noopener">India Post</a>
        </Source>
        <div className="two">
          <div className="card mini"><div className="k">{hi ? 'शेयर बाज़ार (NSE/BSE)' : 'Share market (NSE/BSE)'}</div><Pill v="no" size="xs">{hi ? 'बंद' : 'Closed'}</Pill><div className="s">{hi ? 'इक्विटी ट्रेडिंग अवकाश' : 'Equity trading holiday'}</div></div>
          <div className="card mini"><div className="k">MCX</div><Pill v={mcx.e === 'Open' ? 'neu' : 'no'} size="xs">{hi ? 'शाम खुला' : 'Evening open'}</Pill><div className="s">{hi ? `सुबह ${mcx.m === 'Closed' ? 'बंद' : 'खुला'} · शाम ${mcx.e === 'Open' ? 'खुला' : 'बंद'}` : `Morning ${mcx.m.toLowerCase()} · evening ${mcx.e.toLowerCase()}`}</div></div>
          <div className="card mini"><div className="k">{hi ? 'डाकघर' : 'Post office'}</div><Pill v="no" size="xs">{hi ? 'बंद' : 'Closed'}</Pill><div className="s">{hi ? 'भारत डाक अखिल भारतीय सूची' : 'India Post All-India list'}{circlesWithout.length ? ` (${hi ? 'अपवाद' : 'not listed in'}: ${circlesWithout.map(circleShort).join(', ')})` : ''}</div></div>
          <div className="card mini"><div className="k">UPI · ATM</div><Pill v="yes" size="xs">{hi ? 'चालू' : 'Working'}</Pill><div className="s">{hi ? 'चेक क्लियरिंग बंद केंद्रों में अगले कार्य दिवस पर' : 'Cheque clearing in closed centres waits for the next working day'}</div></div>
        </div>
        <div className="sech"><h2>{hi ? 'बैंक बंद' : 'Banks closed'}</h2><span>{closed.length} {hi ? 'केंद्र' : 'centres'}</span></div>
        <div className="card list">
          {closed.map((o) => (
            <div className="row" key={o.slug}><div className="nm"><a href={`/bank-holidays-2026/${o.state.slug}`}><b>{o.name}</b></a> · {hi ? o.state.hi : o.state.name}<small>RBI: {o.h.n}</small></div><Pill v="no" size="xs">{hi ? 'बंद' : 'Closed'}</Pill></div>
          ))}
        </div>
        <p className="note">{hi ? <><b>मैपिंग:</b> पंजाब और हरियाणा के लिए आरबीआई का अलग कार्यालय नहीं है; हम आरबीआई चंडीगढ़ की सूची (बंद) दिखाते हैं।</> : <><b>Mapping:</b> Punjab and Haryana have no RBI office of their own; they use the RBI Chandigarh list, which shows banks closed. Co-operative banks and RRBs may differ.</>}</p>
        <div className="sech"><h2>{hi ? 'बैंक खुले' : 'Banks open'}</h2><span>{open.length} {hi ? 'केंद्र' : 'centres'}</span></div>
        <div className="card list">
          {open.map((o) => (
            <div className="row" key={o.slug}><div className="nm">{o.state ? <a href={`/bank-holidays-2026/${o.state.slug}`}><b>{o.name}</b></a> : <b>{o.name}</b>}{o.state ? ` · ${hi ? o.state.hi : o.state.name}` : ''}<small>{hi ? 'इस दिन आरबीआई अवकाश नहीं' : 'No RBI holiday this day'}</small></div><Pill v="yes" size="xs">{hi ? 'खुला' : 'Open'}</Pill></div>
          ))}
        </div>
        <Share lang={lang} text={hi ? 'गुरु नानक जयंती 2026: बैंक कहाँ खुले, कहाँ बंद' : 'Guru Nanak Jayanti 2026 (24 Nov): where banks are open or closed'} path={path} />
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={gnjFaq(lang)} />
        <p className="footsrc">{hi ? <><a href="/is-bank-open-on-guru-nanak-jayanti-2026">English</a> · <a href="/hi/aaj-bank-khula-hai">आज बैंक खुला है?</a></> : <><a href="/hi/guru-nanak-jayanti-2026-bank-khula-hai">हिंदी</a> · <a href="/bank-holidays/november-2026">All November 2026 bank holidays</a> · <a href="/bank-holiday-today">Bank holiday today</a></>}</p>
      </div>
      <aside className="side">
        <div className="card panel"><div className="top"><h2>{hi ? 'नवंबर 2026' : 'Also in November 2026'}</h2></div>
          <div className="prow"><a href="/bank-holidays/november-2026">{hi ? 'नवंबर की सभी छुट्टियाँ' : 'All November holidays'}</a></div>
          <div className="prow"><a href="/bengaluru/bank">{hi ? 'बेंगलुरु: 27 नवंबर कनकदास जयंती' : 'Bengaluru: 27 Nov, Kanakadasa Jayanthi'}</a></div>
          <div className="prow"><a href="/saturday-bank-holiday">{hi ? '28 नवंबर: चौथा शनिवार' : '28 Nov: fourth Saturday'}</a></div>
        </div>
      </aside>
    </div>
  );
}
