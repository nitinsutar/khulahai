import { CITIES, type City } from '@/lib/places';
import { chequeClearing, officeLabel, parseIsoDate, CTS_CIRCULARS, CTS_PRESENTATION, CTS_CONFIRMATION, type Cutoff, type ClearingResult } from '@/lib/clearing';
import { fmtLong, todayIST } from '@/lib/date';
import { bankShort } from '@/lib/text';
import { LAST_CHECKED, RBI } from '@/lib/data';
import { toolPath } from '@/lib/toolPaths';
import { Crumb, Faq, Pill, Source } from './ui';
import { ToolNav, CopyShare } from './tools';
import type { Lang } from '@/lib/lang';

function readParam(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export type ChequeQuery = { date?: string; cutoff?: string; city?: string; same?: string };

export function parseChequeQuery(q: ChequeQuery, fallbackCity?: string): { date: string; cutoff: Cutoff; citySlug: string; sameBank: boolean; submitted: boolean } {
  const has = Boolean(q.date || q.cutoff || q.city || q.same);
  const date = parseIsoDate(q.date) ?? todayIST();
  const cutoff: Cutoff = q.cutoff === 'after' ? 'after' : 'before';
  const citySlug = CITIES.some((c) => c.slug === q.city) ? q.city! : (fallbackCity && CITIES.some((c) => c.slug === fallbackCity) ? fallbackCity : 'mumbai');
  const sameBank = q.same === '1' || q.same === 'yes' || q.same === 'true';
  return { date, cutoff, citySlug, sameBank, submitted: has };
}

function skipLine(s: { date: string; reason: Parameters<typeof bankShort>[0] }, lang: Lang) {
  return `${fmtLong(s.date, lang)}: ${bankShort(s.reason, lang)}`;
}

function ResultCard({ r, lang }: { r: ClearingResult; lang: Lang }) {
  const hi = lang === 'hi';
  if (r.kind === 'invalid') {
    return (
      <section className="card hero" aria-labelledby="ans">
        <h1 className="qh">{hi ? 'चेक कब क्रेडिट होगा?' : 'When will my cheque be credited?'}</h1>
        <p className="big" id="ans">{hi ? 'तारीख या शहर सही नहीं है' : 'The date or city is not valid'}</p>
        <p className="reason">{hi ? 'कृपया 2026 की एक सही तारीख और सूची में मौजूद शहर चुनें।' : 'Please pick a valid date in 2026 and a city from the list.'}</p>
      </section>
    );
  }
  if (r.kind === 'pending') {
    const msg = r.why === 'no-2027'
      ? (hi
        ? '2027 की आधिकारिक आरबीआई अवकाश सूची अभी प्रकाशित नहीं हुई है, इसलिए हम क्लीयरिंग की तारीख नहीं दे सकते।'
        : 'The official RBI holiday list for 2027 has not been published yet, so we cannot give a clearing date.')
      : (hi
        ? 'यह गणना 2026 की आधिकारिक आरबीआई अवकाश सूची पर आधारित है। कृपया 2026 की तारीख चुनें।'
        : 'This calculator uses the official RBI holiday list for 2026. Please pick a date in 2026.');
    return (
      <section className="card hero" aria-labelledby="ans">
        <h1 className="qh">{hi ? 'चेक कब क्रेडिट होगा?' : 'When will my cheque be credited?'}</h1>
        <p className="big" id="ans">{hi ? 'अभी तारीख नहीं दे सकते' : 'We cannot give a date yet'}</p>
        <p className="reason">{msg}</p>
      </section>
    );
  }
  const sameDay = r.creditDate === r.depositDate;
  const office = officeLabel(r.city);
  const answer = sameDay
    ? (hi ? `उसी दिन, ${fmtLong(r.creditDate, 'hi')}` : `The same day, ${fmtLong(r.creditDate)}`)
    : fmtLong(r.creditDate, lang);
  const share = hi
    ? `${r.city.hi} में ${fmtLong(r.depositDate, 'hi')} को जमा चेक की अनुमानित क्रेडिट तारीख: ${fmtLong(r.creditDate, 'hi')}`
    : `Estimated credit date for a cheque deposited in ${r.city.name} on ${fmtLong(r.depositDate)}: ${fmtLong(r.creditDate)}`;
  const path = `${toolPath(lang, 'cheque')}?date=${r.depositDate}&cutoff=${r.cutoff}&city=${r.city.slug}&same=${r.sameBank ? '1' : '0'}`;
  return (
    <section className="card hero" aria-labelledby="ans">
      <h1 className="qh">{hi ? 'चेक कब क्रेडिट होगा?' : 'When will my cheque be credited?'}</h1>
      <p className="big" id="ans">{answer}</p>
      <div className="statusrow"><Pill v="neu" size="lg">{hi ? 'अनुमान' : 'Estimate'}</Pill><span className="dt t">{hi ? 'शाखा से पुष्टि करें' : 'Confirm with your branch'}</span></div>
      <p className="reason">
        {hi
          ? `यह एक अनुमान है। जमा: ${fmtLong(r.depositDate, 'hi')}, ${r.cutoff === 'before' ? 'शाखा की कट-ऑफ से पहले' : 'शाखा की कट-ऑफ के बाद'}, ${r.city.hi} (आरबीआई केंद्र: ${office.officeName})${r.city.derived ? `, ${office.officeName} की सूची` : ''}।`
          : `This is an estimate. Deposit: ${fmtLong(r.depositDate)}, ${r.cutoff === 'before' ? 'before' : 'after'} the branch cut-off, in ${r.city.name} (RBI centre: ${office.officeName})${r.city.derived ? `, which uses the ${office.officeName} list` : ''}.`}
      </p>
      {r.sameBank && (
        <p className="reason">
          {hi
            ? 'यह उसी बैंक का चेक माना गया है। ऐसे चेक आमतौर पर बैंक अपने भीतर संसाधित करता है, सीटीएस के बाहर। हम फिर भी रविवार, दूसरे और चौथे शनिवार और इस केंद्र की आरबीआई छुट्टियाँ छोड़ते हैं। शाखा से पुष्टि करें।'
            : 'This is treated as a same-bank cheque. Those are usually processed by the bank itself, not through CTS. We still skip Sundays, 2nd and 4th Saturdays, and RBI holidays for this centre. Confirm with your branch.'}
        </p>
      )}
      {!r.sameBank && r.skipped.length > 0 && (
        <p className="reason">
          {hi ? 'इन दिनों क्लीयरिंग नहीं होती, इसलिए तारीख आगे बढ़ी: ' : 'Clearing does not run on these days, so the date moved: '}
          {r.skipped.map((s) => skipLine(s, lang)).join(hi ? '; ' : '; ')}.
        </p>
      )}
      {!r.sameBank && r.cutoff === 'after' && r.creditDate !== r.depositDate && (
        <p className="reason">
          {hi
            ? 'कट-ऑफ के बाद जमा माना गया है, इसलिए प्रस्तुति अगले क्लीयरिंग दिन पर जाती है।'
            : 'Because the deposit is after the branch cut-off, presentation moves to the next clearing day.'}
        </p>
      )}
      <CopyShare text={share} path={path} lang={lang} />
    </section>
  );
}

export function ChequeView({ lang = 'en', query, fallbackCity }: { lang?: Lang; query: ChequeQuery; fallbackCity?: string }) {
  const hi = lang === 'hi';
  const parsed = parseChequeQuery(query, fallbackCity);
  const result = chequeClearing({ depositDate: parsed.date, cutoff: parsed.cutoff, citySlug: parsed.citySlug, sameBank: parsed.sameBank });
  const action = toolPath(lang, 'cheque');
  const faq = hi
    ? [
        { q: 'क्या बैंक का नाम बताना जरूरी है?', a: 'नहीं। अनुसूचित बैंकों के लिए सीटीएस नियम एक जैसे हैं। तारीख केवल शहर (आरबीआई केंद्र), जमा की तारीख, शाखा की कट-ऑफ की मान्यता, और यह कि चेक उसी बैंक का है या नहीं, से बदलती है।' },
        { q: 'शाखा की कट-ऑफ क्या है?', a: 'यह हर बैंक और शाखा में अलग होती है, और आमतौर पर सीटीएस प्रस्तुति सत्र की समाप्ति (दोपहर 3 बजे IST) से पहले होती है। हम आपकी चुनी हुई स्थिति को मानकर चलते हैं।' },
        { q: 'यह अनुमान किस नियम पर है?', a: 'आरबीआई के सतत क्लीयरिंग और वसूली पर निपटान नियम (चरण 1, 4 अक्टूबर 2025 से लागू) पर। चरण 2 को 24 दिसंबर 2025 के परिपत्र से अगले आदेश तक स्थगित किया गया है। प्रस्तुति सुबह 9 से दोपहर 3 बजे IST, पुष्टि सुबह 9 से शाम 7 बजे IST। प्रस्तुत करने वाला बैंक निपटान के एक घंटे के भीतर जमा करने को कहा गया है।' },
        { q: 'छुट्टी के दिन NEFT या RTGS चलेगा?', a: 'हाँ। आरबीआई के अनुसार NEFT और RTGS सभी दिनों, छुट्टियों सहित, चौबीसों घंटे चलते हैं। शाखा का काउंटर फिर भी बंद हो सकता है। नेट या मोबाइल बैंकिंग से लेन-देन हो सकता है।' },
      ]
    : [
        { q: 'Do I need to name the banks?', a: 'No. CTS rules are the same for scheduled banks. The date changes only with the city (its RBI centre), the deposit date, the branch cut-off assumption, and whether the cheque is on the same bank.' },
        { q: 'What is the branch cut-off?', a: 'It varies by bank and branch, and is usually earlier than the end of the CTS presentation session (3 pm IST). We use the before or after choice you make as an assumption.' },
        { q: 'Which RBI rule is this estimate based on?', a: 'RBI continuous clearing with settlement on realisation, Phase 1, in effect from 4 October 2025. Phase 2 was postponed until further notice by the circular of 24 December 2025. Presentation is 9 am to 3 pm IST, confirmation 9 am to 7 pm IST. The presenting bank is to credit the customer within one hour of settlement.' },
        { q: 'Do NEFT and RTGS work on a bank holiday?', a: 'Yes. RBI has made both NEFT and RTGS available on all days of the year, including holidays, around the clock. Branch counters may still be closed. Transfers can be made through net or mobile banking.' },
      ];
  const city = CITIES.find((c) => c.slug === parsed.citySlug) as City;
  return (
    <div className="layout narrow">
      <div>
        <Crumb lang={lang} items={[{ href: hi ? '/hi' : '/', label: hi ? 'होम' : 'Home' }, { label: hi ? 'चेक क्लीयरिंग' : 'Cheque clearing' }]} />
        <div className="phero"><div><div className="e">{hi ? 'साधन' : 'Tools'}</div><h1>{hi ? 'चेक क्लीयरिंग की तारीख' : 'Cheque clearing date'}</h1></div></div>
        <ToolNav lang={lang} current="cheque" />
        <p className="lead">
          {hi
            ? 'जमा की तारीख, कट-ऑफ की मान्यता और शहर चुनें। हम उस शहर के आरबीआई केंद्र की आधिकारिक छुट्टियाँ, रविवार, और दूसरे व चौथे शनिवार छोड़कर अनुमानित क्रेडिट तारीख बताते हैं। बैंक के नाम की जरूरत नहीं है।'
            : 'Pick the deposit date, a cut-off assumption and the city. We skip official RBI holidays for that city\'s centre, plus Sundays and 2nd and 4th Saturdays, to estimate the credit date. You do not need to name the banks.'}
        </p>
        {parsed.submitted ? <ResultCard r={result} lang={lang} /> : null}
        <form className="card toolform" method="get" action={action}>
          <div className="fg">
            <label htmlFor="date">{hi ? 'जमा की तारीख' : 'Deposit date'}</label>
            <input className="t" id="date" name="date" type="date" required min="2026-01-01" max="2027-12-31" defaultValue={parsed.date} />
          </div>
          <fieldset className="fg">
            <legend>{hi ? 'शाखा की कट-ऑफ' : 'Branch cut-off'}</legend>
            <p className="hint">
              {hi
                ? 'कट-ऑफ हर बैंक और शाखा में अलग होती है, आमतौर पर सीटीएस प्रस्तुति सत्र (दोपहर 3 बजे IST) से पहले। नीचे की पसंद एक मान्यता है।'
                : 'The cut-off varies by bank and branch, and is usually earlier than the CTS presentation close (3 pm IST). The choice below is an assumption.'}
            </p>
            <label className="radio"><input type="radio" name="cutoff" value="before" defaultChecked={parsed.cutoff !== 'after'} /> {hi ? 'कट-ऑफ से पहले जमा' : 'Deposited before the cut-off'}</label>
            <label className="radio"><input type="radio" name="cutoff" value="after" defaultChecked={parsed.cutoff === 'after'} /> {hi ? 'कट-ऑफ के बाद जमा' : 'Deposited after the cut-off'}</label>
          </fieldset>
          <div className="fg">
            <label htmlFor="city">{hi ? 'शहर' : 'City'}</label>
            <select id="city" name="city" defaultValue={parsed.citySlug}>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>{hi ? c.hi : c.name}{c.derived ? ` (${hi ? 'आरबीआई' : 'RBI'}: ${RBI.offices[c.office].name})` : ''}</option>
              ))}
            </select>
          </div>
          <fieldset className="fg">
            <legend>{hi ? 'क्या यह उसी बैंक का चेक है?' : 'Is this a same-bank cheque?'}</legend>
            <p className="hint">
              {hi
                ? 'जमा खाते और चेक जिस बैंक पर लिखा है, वह एक ही है या नहीं। बैंक के नाम की जरूरत नहीं।'
                : 'Whether the cheque is drawn on the same bank as the account you are depositing into. Bank names are not needed.'}
            </p>
            <label className="radio"><input type="radio" name="same" value="0" defaultChecked={!parsed.sameBank} /> {hi ? 'नहीं, दूसरे बैंक का चेक (सीटीएस)' : 'No, a different bank (CTS)'}</label>
            <label className="radio"><input type="radio" name="same" value="1" defaultChecked={parsed.sameBank} /> {hi ? 'हाँ, उसी बैंक का चेक' : 'Yes, the same bank'}</label>
          </fieldset>
          <button className="btn pri" type="submit">{hi ? 'तारीख बताएँ' : 'Show the date'}</button>
        </form>
        {!parsed.submitted && result.kind !== 'invalid' ? <ResultCard r={result} lang={lang} /> : null}
        <Source tag="RBI" checked={LAST_CHECKED} lang={lang}>
          <a href={CTS_CIRCULARS.phase1.href} rel="noopener">{CTS_CIRCULARS.phase1.id}</a>
          {', '}
          <a href={CTS_CIRCULARS.phase2postponed.href} rel="noopener">{CTS_CIRCULARS.phase2postponed.id}</a>
          {hi ? ', अवकाश तालिका' : ', Holiday Matrix'}
        </Source>
        <div className="card prose">
          <h2>{hi ? 'नियम, संक्षेप में' : 'The rule, in brief'}</h2>
          <p>
            {hi
              ? `चरण 1, 4 अक्टूबर 2025 से लागू है। प्रस्तुति सत्र ${CTS_PRESENTATION}, पुष्टि सत्र ${CTS_CONFIRMATION}। निपटान वसूली पर, सुबह 11 बजे से हर घंटे। प्रस्तुत करने वाला बैंक सफल निपटान के एक घंटे के भीतर ग्राहक को जमा करने को कहा गया है, सामान्य सुरक्षा शर्तों के साथ।`
              : `Phase 1 has been in effect since 4 October 2025. The presentation session is ${CTS_PRESENTATION} and the confirmation session is ${CTS_CONFIRMATION}. Settlement is on realisation, every hour from 11 am. The presenting bank is to release the payment immediately, and not later than one hour after a successful settlement, subject to usual safeguards.`}
          </p>
          <p>
            {hi
              ? `चरण 2 (तीन घंटे में पुष्टि) को परिपत्र ${CTS_CIRCULARS.phase2postponed.id} (24 दिसंबर 2025) से अगले आदेश तक स्थगित किया गया है। उसी परिपत्र ने प्रस्तुति का समय सुबह 9 से दोपहर 3 बजे कर दिया।`
              : `Phase 2 (confirmation within three hours) was postponed until further notice by circular ${CTS_CIRCULARS.phase2postponed.id} (24 December 2025). That circular also set the presentation window at 9 am to 3 pm.`}
          </p>
          <p>
            {hi
              ? 'सीटीएस उन दिनों नहीं चलता जब उस केंद्र पर आरबीआई अवकाश हो, या रविवार हो, या महीने का दूसरा या चौथा शनिवार हो।'
              : 'CTS does not run on an RBI holiday for that centre, or on a Sunday, or on the 2nd or 4th Saturday of the month.'}
          </p>
          <h2>{hi ? 'छुट्टी के दिन NEFT और RTGS' : 'NEFT and RTGS on a holiday'}</h2>
          <p>
            {hi
              ? <>आरबीआई ने <a href={CTS_CIRCULARS.neft.href} rel="noopener">NEFT</a> को 16 दिसंबर 2019 से और <a href={CTS_CIRCULARS.rtgs.href} rel="noopener">RTGS</a> को 14 दिसंबर 2020 से सभी दिनों, छुट्टियों सहित, चौबीसों घंटे चालू रखा है। शाखा काउंटर बंद हो सकते हैं।</>
              : <>RBI has made <a href={CTS_CIRCULARS.neft.href} rel="noopener">NEFT</a> available on all days, including holidays, from 16 December 2019, and <a href={CTS_CIRCULARS.rtgs.href} rel="noopener">RTGS</a> around the clock from 14 December 2020. Branch counters may still be closed.</>}
          </p>
        </div>
        <div className="sech"><h2>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Questions people ask'}</h2></div>
        <Faq items={faq} />
      </div>
    </div>
  );
}
