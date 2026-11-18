import { City, stateBySlug } from '@/lib/places';
import type { Lang } from '@/lib/lang';
import { cityName, cityIn, stateName, prefix } from '@/lib/lang';
import { t } from '@/lib/copy';

import { bankDay, cityHolidays, circleList, circleOf, INDIAPOST, postDay, RBI, secondOrFourthSat, type Hol } from '@/lib/data';
import { addDays, dayNum, dow, fmtDM, fmtLong, monthName, monthNum } from '@/lib/date';
import { shortName } from '@/lib/names';
import { GNJ_2026 } from '@/lib/titles';
import { Pill } from './ui';

const NTH_EN = ['first', 'second', 'third', 'fourth', 'fifth'] as const;
const NTH_HI = ['पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ'] as const;

const NTH_MR = ['पहिला', 'दुसरा', 'तिसरा', 'चौथा', 'पाचवा'] as const;
const NTH_GU = ['પહેલો', 'બીજો', 'ત્રીજો', 'ચોથો', 'પાંચમો'] as const;
const NTH_BN = ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম'] as const;

function nthOf(iso: string, lang: Lang) {
  const n = Math.ceil(dayNum(iso) / 7);
  if (lang === 'hi') return NTH_HI[n - 1];
  if (lang === 'mr') return NTH_MR[n - 1];
  if (lang === 'gu') return NTH_GU[n - 1];
  if (lang === 'bn') return NTH_BN[n - 1];
  return NTH_EN[n - 1];
}

function thisSaturday(today: string) {
  return addDays(today, (6 - dow(today) + 7) % 7);
}

function nextBankSatOff(today: string) {
  for (let i = 0; i < 60; i++) {
    const d = addDays(today, i);
    if (secondOrFourthSat(d) && d >= today) return d;
  }
  return null;
}

function remainingRbi(hols: Hol[], today: string) {
  return hols.filter((h) => h.d >= today && h.d.startsWith('2026')).sort((a, b) => a.d.localeCompare(b.d));
}

function remainingPost2026(state: string, today: string) {
  const all = new Set((INDIAPOST.circles['All India'] ?? []).map((h) => h.d));
  return circleList(state)
    .filter((h) => h.d >= today && h.d.startsWith('2026'))
    .map((h) => ({ ...h, allIndia: all.has(h.d) }));
}

function festivalDiffs(city: City, today: string, days = 50) {
  const hols = cityHolidays(city);
  const out: { d: string; bankClosed: boolean; postClosed: boolean; bankName?: string; postName?: string }[] = [];
  for (let i = 0; i <= days; i++) {
    const d = addDays(today, i);
    if (!d.startsWith('2026')) break;
    if (d === GNJ_2026) continue; // covered in the Guru Nanak Jayanti note
    const b = bankDay(hols, d);
    const p = postDay(city.state, d, hols);
    const bankClosed = !b.open && b.reason.kind === 'holiday';
    const postClosed = p.state === 'closed' && p.kind === 'holiday';
    if (bankClosed !== postClosed) {
      out.push({ d, bankClosed, postClosed, bankName: b.reason.name, postName: p.name });
    }
  }
  return out;
}

export function BankCityLead({ city, today, lang = 'en' }: { city: City; today: string; lang?: Lang }) {
  if (lang !== 'en' && lang !== 'hi') return <RegionalBankLead city={city} today={today} lang={lang} />;
  const hi = lang === 'hi';
  const st = stateBySlug(city.state)!;
  const hols = cityHolidays(city);
  const centre = RBI.offices[city.office].name;
  const cname = hi ? city.hi : city.name;
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const satS = bankDay(hols, sat);
  const nextSat = nextBankSatOff(today);
  const gnj = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const where = hi ? st.hi : st.name;

  return (
    <div className="citylead">
      {city.derived && (
        <p className="note">
          {hi
            ? <><b>{cname} का अपना आरबीआई कार्यालय नहीं है।</b> यहाँ बैंक छुट्टियाँ {where} के लिए आरबीआई {centre} केंद्र की सूची से ली जाती हैं।</>
            : <><b>{city.name} has no RBI office of its own.</b> Bank holidays here follow the RBI {centre} centre list for {st.name}.</>}
        </p>
      )}
      <div className="sech"><h2>{hi ? `${cname} में आगे की आरबीआई छुट्टियाँ` : `RBI holidays still ahead in ${city.name}`}</h2><span>2026</span></div>
      <p className="note">
        {next
          ? (hi
            ? <>{next.d === today ? 'आज' : 'अगली'} आरबीआई छुट्टी {cname} के बैंकों के लिए <b>{fmtLong(next.d, 'hi')}</b> है: {shortName(next.n, 'hi')} (आरबीआई {centre} केंद्र)।</>
            : <>The {next.d === today ? 'RBI holiday today' : 'next RBI holiday'} for banks in {city.name} is <b>{fmtLong(next.d)}</b>: {shortName(next.n)} (RBI {centre} centre).</>)
          : (hi
            ? <>2026 की आरबीआई {centre} सूची में {cname} के लिए कोई और त्योहार अवकाश नहीं बचा है। 2027 की तालिका अभी प्रकाशित नहीं हुई है।</>
            : <>The 2026 RBI {centre} list has no further festival holiday for banks in {city.name}. The 2027 matrix is not published yet.</>)}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d}>
              <div className="nm"><b>{shortName(h.n, lang)}</b><small className="t">{fmtLong(h.d, lang)}{h.n !== shortName(h.n) ? ` · RBI: ${h.n}` : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? (hi ? 'आज' : 'Today') : Tclosed(hi)}</Pill>
            </div>
          ))}
        </div>
      )}

      <div className="sech"><h2>{hi ? `${cname} में इस शनिवार` : `This Saturday in ${city.name}`}</h2></div>
      <p className="note">
        {hi
          ? <>इस शनिवार, <b>{fmtDM(sat, 'hi')}</b>, {monthName(monthNum(sat), 'hi')} का {nthOf(sat, 'hi')} शनिवार है, इसलिए {cname} में बैंक {satS.open ? 'खुले रहेंगे' : 'बंद रहेंगे'}। सभी बैंक केवल दूसरे और चौथे शनिवार को बंद रहते हैं।{nextSat ? <> अगली ऐसी छुट्टी {fmtDM(nextSat, 'hi')} है।</> : null}</>
          : <>This Saturday, <b>{fmtDM(sat)}</b>, is the {nthOf(sat, 'en')} Saturday of {monthName(monthNum(sat))}, so banks in {city.name} are {satS.open ? 'open' : 'closed'}. Banks close only on the second and fourth Saturday.{nextSat ? <> The next such day off is {fmtDM(nextSat)}.</> : null}</>}
      </p>

      {gnj && (
        <p className="note">
          <b>{hi ? '24 नवंबर, गुरु नानक जयंती:' : '24 Nov, Guru Nanak Jayanti:'}</b>{' '}
          {gnj.open
            ? (hi
              ? `${cname} में बैंक खुले रहेंगे; आरबीआई ${centre} केंद्र पर इस दिन अवकाश नहीं है। ${cname} में डाकघर बंद हैं, क्योंकि गुरु नानक जयंती भारत डाक की अखिल भारतीय सूची में है।`
              : `banks in ${city.name} stay open; the RBI ${centre} list has no holiday that day. Post offices in ${city.name} are closed, because Guru Nanak's Birthday is on India Post's All-India list.`)
            : (hi
              ? `${cname} में बैंक बंद हैं (आरबीआई ${centre} सूची)। ${cname} में डाकघर भी बंद हैं; यह अखिल भारतीय डाक अवकाश है।`
              : `banks in ${city.name} are closed (RBI ${centre} list). Post offices in ${city.name} are also closed; it is an All-India postal holiday.`)}
          {' '}<a href={hi ? '/hi/guru-nanak-jayanti-2026-bank-khula-hai' : '/is-bank-open-on-guru-nanak-jayanti-2026'}>{hi ? 'शहरवार सूची' : 'City-wise list'}</a>
          {' · '}<a href={`${hi ? '/hi' : ''}/${city.slug}/post-office`}>{hi ? 'डाकघर आज' : 'Post office today'}</a>.
        </p>
      )}

      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{hi ? 'जब बैंक और डाकघर अलग हैं' : `When banks and post offices differ in ${city.name}`}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>{u.bankClosed ? (hi ? `बैंक बंद: ${shortName(u.bankName!, 'hi')}` : `Banks closed: ${shortName(u.bankName!)}`) : (hi ? 'बैंक खुले' : 'Banks open')}
                    {' · '}
                    {u.postClosed ? (hi ? `डाकघर बंद${u.postName ? `: ${u.postName}` : ''}` : `Post office closed${u.postName ? `: ${u.postName}` : ''}`) : (hi ? 'डाकघर अवकाश सूची में नहीं' : 'Not on the postal holiday list')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Tclosed(hi: boolean) {
  return hi ? 'बंद' : 'Closed';
}

export function PostCityLead({ city, today, lang = 'en' }: { city: City; today: string; lang?: Lang }) {
  if (lang !== 'en' && lang !== 'hi') return <RegionalPostLead city={city} today={today} lang={lang} />;
  const hi = lang === 'hi';
  const hols = cityHolidays(city);
  const circ = circleOf(city.state);
  const cname = hi ? city.hi : city.name;
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const gnjBank = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const nextSat = nextBankSatOff(today);

  return (
    <div className="citylead">
      {circ.note && (
        <p className="note">
          {hi
            ? <><b>{cname}</b> भारत डाक के {circ.name} की सूची से आता है।</>
            : <><b>{city.name}</b> is covered by India Post’s {circ.name}. {circ.note}.</>}
        </p>
      )}
      <div className="sech"><h2>{hi ? `${cname} में आगे की डाक छुट्टियाँ` : `India Post holidays still ahead in ${city.name}`}</h2><span>{circ.name}</span></div>
      <p className="note">
        {next
          ? (hi
            ? <>{cname} के डाकघरों की {next.d === today ? 'आज की' : 'अगली'} छुट्टी <b>{fmtLong(next.d, 'hi')}</b> है: {next.n}{next.allIndia ? ' (अखिल भारतीय अवकाश)' : ''}। स्रोत: भारत डाक, {circ.name}।</>
            : <>The {next.d === today ? 'postal holiday today' : 'next postal holiday'} for {city.name} is <b>{fmtLong(next.d)}</b>: {next.n}{next.allIndia ? ' (an All-India postal holiday)' : ''}. Source: India Post, {circ.name}.</>)
          : (hi
            ? <>2026 की {circ.name} सूची में {cname} के लिए कोई और डाक अवकाश नहीं बचा है। सर्कल की 2027 सूची अभी प्रकाशित नहीं हुई है।</>
            : <>The 2026 {circ.name} list has no further postal holiday for {city.name}. The 2027 circle list is not published yet.</>)}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d + h.n}>
              <div className="nm"><b>{h.n}</b><small className="t">{fmtLong(h.d, lang)}{h.allIndia ? (hi ? ' · अखिल भारतीय' : ' · All-India') : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? (hi ? 'आज' : 'Today') : Tclosed(hi)}</Pill>
            </div>
          ))}
        </div>
      )}

      <div className="sech"><h2>{hi ? `${cname} में इस शनिवार` : `This Saturday in ${city.name}`}</h2></div>
      <p className="note">
        {hi
          ? <>इस शनिवार, <b>{fmtDM(sat, 'hi')}</b>, {circ.name} की अवकाश सूची में नहीं है। बैंकों का दूसरे/चौथे शनिवार का नियम डाकघरों पर लागू नहीं होता, और शनिवार का समय {cname} में कार्यालय के अनुसार अलग होता है।{nextSat ? <> उस दिन बैंक बंद रहेंगे ({fmtDM(nextSat, 'hi')} अगला बैंक-शनिवार अवकाश है)।</> : null}</>
          : <>This Saturday, <b>{fmtDM(sat)}</b>, is not on the {circ.name} holiday list. The banks’ 2nd and 4th Saturday rule does not apply to post offices, and Saturday hours in {city.name} vary by office.{nextSat ? <> Banks will be closed on the next 2nd or 4th Saturday, {fmtDM(nextSat)}.</> : null}</>}
      </p>

      {gnjBank && (
        <p className="note">
          <b>{hi ? '24 नवंबर, गुरु नानक जयंती:' : "24 Nov, Guru Nanak's Birthday:"}</b>{' '}
          {hi
            ? `पूरे भारत में डाकघर बंद हैं (भारत डाक की अखिल भारतीय सूची)। ${cname} में बैंक उस दिन ${gnjBank.open ? 'खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है' : 'भी बंद हैं, आरबीआई सूची के अनुसार'}।`
            : `post offices across India are closed (India Post All-India list). Banks in ${city.name} ${gnjBank.open ? 'stay open that day; RBI lists no holiday for this centre' : 'are also closed, from the RBI holiday matrix'}.`}
          {' '}<a href={`${hi ? '/hi' : ''}/${city.slug}/bank`}>{hi ? 'बैंक आज' : 'Bank today'}</a>.
        </p>
      )}

      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{hi ? `${cname} में बैंकों से अलग दिन` : `Days in ${city.name} when this differs from banks`}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>{u.postClosed ? (hi ? `डाकघर बंद${u.postName ? `: ${u.postName}` : ''}` : `Post office closed${u.postName ? `: ${u.postName}` : ''}`) : (hi ? 'डाक अवकाश सूची में नहीं' : 'Not on the postal holiday list')}
                    {' · '}
                    {u.bankClosed ? (hi ? `बैंक बंद: ${shortName(u.bankName!, 'hi')}` : `Banks closed: ${shortName(u.bankName!)}`) : (hi ? 'बैंक खुले' : 'Banks open')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function bankCityFaqs(city: City, today: string, lang: Lang) {
  const hols = cityHolidays(city);
  const st = stateBySlug(city.state)!;
  const centre = RBI.offices[city.office].name;
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const nextSat = nextBankSatOff(today);
  const derived = city.derived
    ? (lang === 'hi' ? ` (${city.hi} का अपना कार्यालय नहीं है, इसलिए ${centre} केंद्र की सूची)` : ` (${city.name} has no RBI office of its own, so this uses the ${centre} list)`)
    : '';
  if (lang === 'hi') {
    return [
      {
        q: `${city.hi} में अगली बैंक छुट्टी कब है?`,
        a: next
          ? `${fmtLong(next.d, 'hi')} को ${shortName(next.n, 'hi')}, आरबीआई ${centre} केंद्र की सूची से।${derived} दूसरे और चौथे शनिवार भी पूरे देश में बैंक अवकाश हैं${nextSat ? `; अगला ${fmtLong(nextSat, 'hi')} है` : ''}।`
          : `2026 की आरबीआई ${centre} सूची में ${city.hi} के लिए कोई और त्योहार अवकाश नहीं बचा है। 2027 की तालिका अभी नहीं आई है। बैंक फिर भी दूसरे और चौथे शनिवार को बंद रहते हैं${nextSat ? `; अगला ${fmtLong(nextSat, 'hi')} है` : ''}।`,
      },
    ];
  }
  return [
    {
      q: `When is the next bank holiday in ${city.name}?`,
      a: next
        ? `${fmtLong(next.d)} is ${shortName(next.n)}, from the RBI ${centre} list for ${st.name}.${derived} The 2nd and 4th Saturdays are also bank holidays nationwide${nextSat ? `; the next one is ${fmtLong(nextSat)}` : ''}.`
        : `The 2026 RBI ${centre} list has no further festival holiday for ${city.name}. The 2027 matrix is not published yet. Banks still close on the 2nd and 4th Saturdays${nextSat ? `; the next one is ${fmtLong(nextSat)}` : ''}.`,
    },
  ];
}

export function postCityFaqs(city: City, today: string, lang: Lang) {
  const circ = circleOf(city.state);
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const gnjOpen = today <= GNJ_2026 ? bankDay(cityHolidays(city), GNJ_2026).open : null;
  if (lang === 'hi') {
    return [
      {
        q: `${city.hi} में अगली डाक छुट्टी कब है?`,
        a: next
          ? `${fmtLong(next.d, 'hi')} को ${next.n}${next.allIndia ? ' (अखिल भारतीय अवकाश)' : ''}, भारत डाक के ${circ.name} से।`
          : `2026 की ${circ.name} सूची में ${city.hi} के लिए कोई और डाक अवकाश नहीं बचा है।`,
      },
      ...(gnjOpen === null ? [] : [{
        q: `24 नवंबर को ${city.hi} में बैंक और डाकघर एक जैसे बंद हैं?`,
        a: gnjOpen
          ? `नहीं। डाकघर बंद हैं (गुरु नानक जयंती, अखिल भारतीय डाक अवकाश), लेकिन ${city.hi} में बैंक खुले रहेंगे; इस केंद्र पर आरबीआई अवकाश नहीं है।`
          : `हाँ। ${city.hi} में बैंक और डाकघर दोनों 24 नवंबर को बंद हैं: बैंक आरबीआई सूची से, डाकघर भारत डाक की अखिल भारतीय सूची से।`,
      }]),
    ];
  }
  return [
    {
      q: `When is the next post office holiday in ${city.name}?`,
      a: next
        ? `${fmtLong(next.d)} is ${next.n}${next.allIndia ? ' (an All-India postal holiday)' : ''}, from India Post’s ${circ.name}.`
        : `The 2026 ${circ.name} list has no further postal holiday for ${city.name}.`,
    },
    ...(gnjOpen === null ? [] : [{
      q: `Are banks and post offices both closed in ${city.name} on 24 Nov?`,
      a: gnjOpen
        ? `No. Post offices are closed for Guru Nanak's Birthday (All-India postal holiday), but banks in ${city.name} stay open; RBI lists no holiday for this centre.`
        : `Yes. Banks and post offices in ${city.name} are both closed on 24 Nov: banks from the RBI list, post offices from India Post's All-India list.`,
    }]),
  ];
}

function RegionalBankLead({ city, today, lang }: { city: City; today: string; lang: Lang }) {
  const hols = cityHolidays(city);
  const centre = RBI.offices[city.office].name;
  const name = cityName(city, lang);
  const loc = cityIn(city, lang);
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const satS = bankDay(hols, sat);
  const nextSat = nextBankSatOff(today);
  const gnj = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const pre = prefix(lang);
  return (
    <div className="citylead">
      {city.derived && <p className="note"><b>{t(lang, 'derivedNote')}</b> {lang === 'mr' ? `यादी आरबीआई ${centre} केंद्राची आहे.` : lang === 'gu' ? `યાદી આરબીઆઈ ${centre} કેન્દ્રની છે.` : `তালিকা আরবিআই ${centre} কেন্দ্রের।`}</p>}
      <div className="sech"><h2>{t(lang, 'remaining2026')}</h2><span>2026 · {centre}</span></div>
      <p className="note">
        {next
          ? (lang === 'mr'
            ? <>{loc} बँकांची {next.d === today ? 'आजची' : 'पुढची'} आरबीआई सुट्टी <b>{fmtLong(next.d, lang)}</b> आहे: {shortName(next.n, lang)} (आरबीआई {centre} केंद्र).</>
            : lang === 'gu'
              ? <>{loc} બેંકની {next.d === today ? 'આજની' : 'આગામી'} આરબીઆઈ રજા <b>{fmtLong(next.d, lang)}</b> છે: {shortName(next.n, lang)} (આરબીઆઈ {centre} કેન્દ્ર).</>
              : <>{loc} ব্যাংকের {next.d === today ? 'আজকের' : 'পরের'} আরবিআই ছুটি <b>{fmtLong(next.d, lang)}</b>: {shortName(next.n, lang)} (আরবিআই {centre} কেন্দ্র)।</>)
          : <>{t(lang, 'noMore2026')} {t(lang, 'list2027')}</>}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d}>
              <div className="nm"><b>{shortName(h.n, lang)}</b><small className="t">{fmtLong(h.d, lang)}{h.n !== shortName(h.n) ? ` · RBI: ${h.n}` : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? t(lang, 'today') : t(lang, 'closed')}</Pill>
            </div>
          ))}
        </div>
      )}
      <div className="sech"><h2>{lang === 'mr' ? `${loc} या शनिवारी` : lang === 'gu' ? `${loc} આ શનિવારે` : `${loc} এই শনিবার`}</h2></div>
      <p className="note">
        {lang === 'mr'
          ? <>या शनिवारी, <b>{fmtDM(sat, lang)}</b>, {monthName(monthNum(sat), lang)}चा {nthOf(sat, lang)} शनिवार आहे, म्हणून {loc} बँक {satS.open ? 'चालू आहे' : 'बंद आहे'}. सर्व बँका फक्त दुसऱ्या आणि चौथ्या शनिवारी बंद असतात.{nextSat ? <> पुढची अशी सुट्टी {fmtDM(nextSat, lang)} आहे.</> : null}</>
          : lang === 'gu'
            ? <>આ શનિવારે, <b>{fmtDM(sat, lang)}</b>, {monthName(monthNum(sat), lang)}નો {nthOf(sat, lang)} શનિવાર છે, તેથી {loc} બેંક {satS.open ? 'ખુલ્લી છે' : 'બંધ છે'}. બધી બેંક ફક્ત બીજા અને ચોથા શનિવારે બંધ રહે છે.{nextSat ? <> આગામી એવી રજા {fmtDM(nextSat, lang)} છે.</> : null}</>
            : <>এই শনিবার, <b>{fmtDM(sat, lang)}</b>, {monthName(monthNum(sat), lang)}-এর {nthOf(sat, lang)} শনিবার, তাই {loc} ব্যাংক {satS.open ? 'খোলা' : 'বন্ধ'}। সব ব্যাংক শুধু দ্বিতীয় ও চতুর্থ শনিবার বন্ধ থাকে।{nextSat ? <> পরের এমন ছুটি {fmtDM(nextSat, lang)}।</> : null}</>}
      </p>
      {gnj && (
        <p className="note">
          <b>{lang === 'mr' ? '24 नोव्हेंबर, गुरु नानक जयंती:' : lang === 'gu' ? '24 નવેમ્બર, ગુરુ નાનક જયંતી:' : '24 নভেম্বর, গুরু নানক জয়ন্তী:'}</b>{' '}
          {gnj.open
            ? (lang === 'mr'
              ? `${loc} बँक चालू राहील; आरबीआई ${centre} केंद्रावर या दिवशी सुट्टी नाही. ${loc} पोस्ट ऑफिस बंद आहे, कारण ही अखिल भारतीय पोस्ट सुट्टी आहे.`
              : lang === 'gu'
                ? `${loc} બેંક ખુલ્લી રહેશે; આરબીઆઈ ${centre} કેન્દ્ર પર આ દિવસે રજા નથી. ${loc} પોસ્ટ ઑફિસ બંધ છે, કારણ કે આ અખિલ ભારતીય પોસ્ટ રજા છે.`
                : `${loc} ব্যাংক খোলা থাকবে; আরবিআই ${centre} কেন্দ্রে এই দিনে ছুটি নেই। ${loc} পোস্ট অফিস বন্ধ, কারণ এটি সারা ভারতে ডাক ছুটি।`)
            : (lang === 'mr'
              ? `${loc} बँक बंद आहे (आरबीआई ${centre} यादी). ${loc} पोस्ट ऑफिसही बंद आहे; ही अखिल भारतीय पोस्ट सुट्टी आहे.`
              : lang === 'gu'
                ? `${loc} બેંક બંધ છે (આરબીઆઈ ${centre} યાદી). ${loc} પોસ્ટ ઑફિસ પણ બંધ છે; આ અખિલ ભારતીય પોસ્ટ રજા છે.`
                : `${loc} ব্যাংক বন্ধ (আরবিআই ${centre} তালিকা)। ${loc} পোস্ট অফিসও বন্ধ; এটি সারা ভারতে ডাক ছুটি।`)}
          {' '}<a href={`${pre}/${city.slug}/post-office`}>{t(lang, 'postToday')}</a>.
        </p>
      )}
      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{lang === 'mr' ? 'जेव्हा बँक आणि पोस्ट ऑफिस वेगळे आहेत' : lang === 'gu' ? 'જ્યારે બેંક અને પોસ્ટ ઑફિસ અલગ હોય' : 'যখন ব্যাংক ও পোস্ট অফিস আলাদা'}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>
                    {u.bankClosed ? `${t(lang, 'bank')} ${t(lang, 'closed')}: ${shortName(u.bankName!, lang)}` : `${t(lang, 'bank')} ${t(lang, 'open')}`}
                    {' · '}
                    {u.postClosed ? `${t(lang, 'postOffice')} ${t(lang, 'closed')}${u.postName ? `: ${shortName(u.postName, lang)}` : ''}` : (lang === 'mr' ? 'पोस्ट सुट्टी यादीत नाही' : lang === 'gu' ? 'પોસ્ટ રજા યાદીમાં નથી' : 'ডাক ছুটির তালিকায় নেই')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RegionalPostLead({ city, today, lang }: { city: City; today: string; lang: Lang }) {
  const hols = cityHolidays(city);
  const circ = circleOf(city.state);
  const loc = cityIn(city, lang);
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const sat = thisSaturday(today);
  const gnjBank = today <= GNJ_2026 ? bankDay(hols, GNJ_2026) : null;
  const diffs = festivalDiffs(city, today);
  const nextSat = nextBankSatOff(today);
  const pre = prefix(lang);
  return (
    <div className="citylead">
      <div className="sech"><h2>{t(lang, 'remaining2026')}</h2><span>{circ.name}</span></div>
      <p className="note">
        {next
          ? (lang === 'mr'
            ? <>{loc} पोस्ट ऑफिसची {next.d === today ? 'आजची' : 'पुढची'} सुट्टी <b>{fmtLong(next.d, lang)}</b> आहे: {shortName(next.n, lang)}{next.allIndia ? ' (अखिल भारतीय सुट्टी)' : ''}. स्रोत: इंडिया पोस्ट, {circ.name}.</>
            : lang === 'gu'
              ? <>{loc} પોસ્ટ ઑફિસની {next.d === today ? 'આજની' : 'આગામી'} રજા <b>{fmtLong(next.d, lang)}</b> છે: {shortName(next.n, lang)}{next.allIndia ? ' (અખિલ ભારતીય રજા)' : ''}. સ્રોત: ઇન્ડિયા પોસ્ટ, {circ.name}.</>
              : <>{loc} পোস্ট অফিসের {next.d === today ? 'আজকের' : 'পরের'} ছুটি <b>{fmtLong(next.d, lang)}</b>: {shortName(next.n, lang)}{next.allIndia ? ' (সারা ভারতে ডাক ছুটি)' : ''}। সূত্র: ইন্ডিয়া পোস্ট, {circ.name}।</>)
          : <>{t(lang, 'noMore2026')} {t(lang, 'list2027')}</>}
      </p>
      {rest.length > 0 && (
        <div className="card list">
          {rest.map((h) => (
            <div className="row" key={h.d + h.n}>
              <div className="nm"><b>{shortName(h.n, lang)}</b><small className="t">{fmtLong(h.d, lang)}{h.allIndia ? ` · ${t(lang, 'allIndia')}` : ''}{shortName(h.n, lang) !== h.n ? ` · ${h.n}` : ''}</small></div>
              <Pill v={h.d === today ? 'no' : 'neu'} size="xs">{h.d === today ? t(lang, 'today') : t(lang, 'closed')}</Pill>
            </div>
          ))}
        </div>
      )}
      <div className="sech"><h2>{lang === 'mr' ? `${loc} या शनिवारी` : lang === 'gu' ? `${loc} આ શનિવારે` : `${loc} এই শনিবার`}</h2></div>
      <p className="note">
        {lang === 'mr'
          ? <>या शनिवारी, <b>{fmtDM(sat, lang)}</b>, {circ.name} च्या सुट्टी यादीत नाही. बँकांचा दुसरा/चौथा शनिवार नियम पोस्ट ऑफिसला लागू नाही. शनिवारी वेळ कार्याल्यानुसार बदलते.{nextSat ? <> त्या दिवशी बँका बंद असतील ({fmtDM(nextSat, lang)} पुढचा बँक-शनिवार अवकाश आहे).</> : null}</>
          : lang === 'gu'
            ? <>આ શનિવારે, <b>{fmtDM(sat, lang)}</b>, {circ.name}ની રજા યાદીમાં નથી. બેંકનો બીજો/ચોથો શનિવાર નિયમ પોસ્ટ ઑફિસને લાગુ નથી. શનિવારે સમય ઑફિસ પ્રમાણે બદલાય છે.{nextSat ? <> તે દિવસે બેંક બંધ રહેશે ({fmtDM(nextSat, lang)} આગામી બેંક-શનિવાર રજા છે).</> : null}</>
            : <>এই শনিবার, <b>{fmtDM(sat, lang)}</b>, {circ.name}-এর ছুটির তালিকায় নেই। ব্যাংকের দ্বিতীয়/চতুর্থ শনিবারের নিয়ম পোস্ট অফিসে লাগে না। শনিবারের সময় অফিসভেদে আলাদা হতে পারে।{nextSat ? <> সেদিন ব্যাংক বন্ধ থাকবে ({fmtDM(nextSat, lang)} পরের ব্যাংক-শনিবার ছুটি)।</> : null}</>}
      </p>
      {gnjBank && (
        <p className="note">
          <b>{lang === 'mr' ? '24 नोव्हेंबर, गुरु नानक जयंती:' : lang === 'gu' ? '24 નવેમ્બર, ગુરુ નાનક જયંતી:' : '24 নভেম্বর, গুরু নানক জয়ন্তী:'}</b>{' '}
          {lang === 'mr'
            ? `भारतभर पोस्ट ऑफिस बंद आहेत (इंडिया पोस्ट अखिल भारतीय यादी). ${loc} बँक त्या दिवशी ${gnjBank.open ? 'चालू राहील; या केंद्रावर आरबीआई सुट्टी नाही' : 'ही बंद आहे, आरबीआई यादीप्रमाणे'}.`
            : lang === 'gu'
              ? `આખા ભારતમાં પોસ્ટ ઑફિસ બંધ છે (ઇન્ડિયા પોસ્ટ અખિલ ભારતીય યાદી). ${loc} બેંક તે દિવસે ${gnjBank.open ? 'ખુલ્લી રહેશે; આ કેન્દ્ર પર આરબીઆઈ રજા નથી' : 'પણ બંધ છે, આરબીઆઈ યાદી પ્રમાણે'}.`
              : `সারা ভারতে পোস্ট অফিস বন্ধ (ইন্ডিয়া পোস্ট সারা-ভারত তালিকা)। ${loc} ব্যাংক সেদিন ${gnjBank.open ? 'খোলা থাকবে; এই কেন্দ্রে আরবিআই ছুটি নেই' : 'ও বন্ধ, আরবিআই তালিকা অনুসারে'}।`}
          {' '}<a href={`${pre}/${city.slug}/bank`}>{t(lang, 'bankToday')}</a>.
        </p>
      )}
      {diffs.length > 0 && (
        <>
          <div className="sech"><h2>{lang === 'mr' ? 'जेव्हा बँक आणि पोस्ट ऑफिस वेगळे आहेत' : lang === 'gu' ? 'જ્યારે બેંક અને પોસ્ટ ઑફિસ અલગ હોય' : 'যখন ব্যাংক ও পোস্ট অফিস আলাদা'}</h2></div>
          <div className="card list">
            {diffs.map((u) => (
              <div className="row" key={u.d}>
                <div className="nm">
                  <b>{fmtDM(u.d, lang)}</b>
                  <small>
                    {u.postClosed ? `${t(lang, 'postOffice')} ${t(lang, 'closed')}${u.postName ? `: ${shortName(u.postName, lang)}` : ''}` : (lang === 'mr' ? 'पोस्ट सुट्टी यादीत नाही' : lang === 'gu' ? 'પોસ્ટ રજા યાદીમાં નથી' : 'ডাক ছুটির তালিকায় নেই')}
                    {' · '}
                    {u.bankClosed ? `${t(lang, 'bank')} ${t(lang, 'closed')}: ${shortName(u.bankName!, lang)}` : `${t(lang, 'bank')} ${t(lang, 'open')}`}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function regionalBankFaqs(city: City, today: string, lang: Lang) {
  const hols = cityHolidays(city);
  const centre = RBI.offices[city.office].name;
  const loc = cityIn(city, lang);
  const rest = remainingRbi(hols, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const nextSat = nextBankSatOff(today);
  const derived = city.derived ? ` (${t(lang, 'derivedNote')})` : '';
  const q = lang === 'mr' ? `${loc} पुढची बँक सुट्टी केव्हा आहे?` : lang === 'gu' ? `${loc} આગામી બેંક રજા ક્યારે છે?` : `${loc} পরের ব্যাংক ছুটি কবে?`;
  const satBit = lang === 'mr'
    ? `दुसरा आणि चौथा शनिवारही देशभर बँक सुट्टी आहे${nextSat ? `; पुढची ${fmtLong(nextSat, lang)} आहे` : ''}.`
    : lang === 'gu'
      ? `બીજો અને ચોથો શનિવાર પણ આખા દેશમાં બેંક રજા છે${nextSat ? `; આગામી ${fmtLong(nextSat, lang)} છે` : ''}.`
      : `দ্বিতীয় ও চতুর্থ শনিবারও সারা দেশে ব্যাংক ছুটি${nextSat ? `; পরেরটি ${fmtLong(nextSat, lang)}` : ''}।`;
  const a = next
    ? (lang === 'mr'
      ? `${fmtLong(next.d, lang)} रोजी ${shortName(next.n, lang)}, आरबीआई ${centre} यादीप्रमाणे.${derived} ${satBit}`
      : lang === 'gu'
        ? `${fmtLong(next.d, lang)}એ ${shortName(next.n, lang)}, આરબીઆઈ ${centre} યાદી પ્રમાણે.${derived} ${satBit}`
        : `${fmtLong(next.d, lang)}-এ ${shortName(next.n, lang)}, আরবিআই ${centre} তালিকা অনুসারে।${derived} ${satBit}`)
    : `${t(lang, 'noMore2026')} ${t(lang, 'list2027')} ${satBit}`;
  return [{ q, a }];
}

function regionalPostFaqs(city: City, today: string, lang: Lang) {
  const circ = circleOf(city.state);
  const loc = cityIn(city, lang);
  const rest = remainingPost2026(city.state, today);
  const next = rest.find((h) => h.d > today) ?? rest.find((h) => h.d === today);
  const gnjOpen = today <= GNJ_2026 ? bankDay(cityHolidays(city), GNJ_2026).open : null;
  const q1 = lang === 'mr' ? `${loc} पुढची पोस्ट सुट्टी केव्हा आहे?` : lang === 'gu' ? `${loc} આગામી પોસ્ટ રજા ક્યારે છે?` : `${loc} পরের ডাক ছুটি কবে?`;
  const a1 = next
    ? (lang === 'mr'
      ? `${fmtLong(next.d, lang)} रोजी ${shortName(next.n, lang)}${next.allIndia ? ' (अखिल भारतीय सुट्टी)' : ''}, इंडिया पोस्ट ${circ.name} यादीप्रमाणे.`
      : lang === 'gu'
        ? `${fmtLong(next.d, lang)}એ ${shortName(next.n, lang)}${next.allIndia ? ' (અખિલ ભારતીય રજા)' : ''}, ઇન્ડિયા પોસ્ટ ${circ.name} યાદી પ્રમાણે.`
        : `${fmtLong(next.d, lang)}-এ ${shortName(next.n, lang)}${next.allIndia ? ' (সারা ভারতে ডাক ছুটি)' : ''}, ইন্ডিয়া পোস্ট ${circ.name} তালিকা অনুসারে।`)
    : t(lang, 'noMore2026');
  const out = [{ q: q1, a: a1 }];
  if (gnjOpen !== null) {
    const q2 = lang === 'mr' ? `24 नोव्हेंबर रोजी ${loc} बँक आणि पोस्ट ऑफिस दोन्ही बंद आहेत का?` : lang === 'gu' ? `24 નવેમ્બરે ${loc} બેંક અને પોસ્ટ ઑફિસ બંને બંધ છે?` : `24 নভেম্বর ${loc} ব্যাংক ও পোস্ট অফিস দুটোই বন্ধ?`;
    const a2 = gnjOpen
      ? (lang === 'mr'
        ? `नाही. पोस्ट ऑफिस बंद आहे (गुरु नानक जयंती, अखिल भारतीय पोस्ट सुट्टी), पण ${loc} बँक चालू राहील; या केंद्रावर आरबीआई सुट्टी नाही.`
        : lang === 'gu'
          ? `ના. પોસ્ટ ઑફિસ બંધ છે (ગુરુ નાનક જયંતી, અખિલ ભારતીય પોસ્ટ રજા), પણ ${loc} બેંક ખુલ્લી રહેશે; આ કેન્દ્ર પર આરબીઆઈ રજા નથી.`
          : `না। পোস্ট অফিস বন্ধ (গুরু নানক জয়ন্তী, সারা ভারতে ডাক ছুটি), কিন্তু ${loc} ব্যাংক খোলা থাকবে; এই কেন্দ্রে আরবিআই ছুটি নেই।`)
      : (lang === 'mr'
        ? `हो. ${loc} बँक आणि पोस्ट ऑफिस दोन्ही 24 नोव्हेंबर रोजी बंद आहेत: बँक आरबीआई यादीप्रमाणे, पोस्ट ऑफिस इंडिया पोस्ट अखिल भारतीय यादीप्रमाणे.`
        : lang === 'gu'
          ? `હા. ${loc} બેંક અને પોસ્ટ ઑફિસ બંને 24 નવેમ્બરે બંધ છે: બેંક આરબીઆઈ યાદી પ્રમાણે, પોસ્ટ ઑફિસ ઇન્ડિયા પોસ્ટ અખિલ ભારતીય યાદી પ્રમાણે.`
          : `হ্যাঁ। ${loc} ব্যাংক ও পোস্ট অফিস দুটোই 24 নভেম্বর বন্ধ: ব্যাংক আরবিআই তালিকা অনুসারে, পোস্ট অফিস ইন্ডিয়া পোস্ট সারা-ভারত তালিকা অনুসারে।`);
    out.push({ q: q2, a: a2 });
  }
  return out;
}
